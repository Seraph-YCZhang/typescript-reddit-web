import { cacheExchange, Resolver, Cache } from '@urql/exchange-graphcache';
import Router from 'next/router';
import { dedupExchange, Exchange, fetchExchange } from 'urql';
import { pipe, tap } from 'wonka';
import {
    CreateCommentMutationVariables,
    DeletePostMutationVariables,
    LoginMutation,
    LogoutMutation,
    MeDocument,
    MeQuery,
    RegisterMutation,
    VoteMutationVariables
} from '../generated/graphql';
import { betterUpdateQuery } from './betterUpdateQuery';
import { stringifyVariables } from '@urql/core';
import gql from 'graphql-tag';
import { isServer } from './isServer';
import { multipartFetchExchange } from '@urql/exchange-multipart-fetch';

const errorExchange: Exchange = ({ forward }) => ops$ => {
    return pipe(
        forward(ops$),
        tap(({ error }) => {
            if (error?.message.includes('not authenticated')) {
                Router.replace('/login');
            }
        })
    );
};

export type MergeMode = 'before' | 'after';

export interface PaginationParams {
    offsetArgument?: string;
    limitArgument?: string;
    mergeMode?: MergeMode;
}

export const cursorPagination = (): Resolver => {
    return (_parent, fieldArgs, cache, info) => {
        const { parentKey: entityKey, fieldName } = info;
        const allFields = cache.inspectFields(entityKey);
        console.log(allFields);
        const fieldInfos = allFields.filter(
            info => info.fieldName === fieldName
        );
        const size = fieldInfos.length;
        if (size === 0) {
            return undefined;
        }
        console.log(allFields);
        const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
        const isItInTheCache = cache.resolve(
            cache.resolveFieldByKey(entityKey, fieldKey) as string,
            'posts'
        );
        info.partial = !isItInTheCache;
        // console.log('partial', info.partial);
        const results: string[] = [];
        let hasMore = true;
        fieldInfos.forEach(fi => {
            const key = cache.resolveFieldByKey(
                entityKey,
                fi.fieldKey
            ) as string;
            const data = cache.resolve(key, 'posts') as string[];
            const _hasMore = cache.resolve(key, 'hasMore');
            if (!_hasMore) {
                hasMore = _hasMore as boolean;
            }
            results.push(...data);
        });
        return {
            __typename: 'PaginatedPosts',
            hasMore,
            posts: results
        };
    };
};

function invalidateAllPosts(cache: Cache) {
    const allFields = cache.inspectFields('Query');
    const fieldInfos = allFields.filter(info => info.fieldName === 'posts');
    fieldInfos.forEach(fi => {
        cache.invalidate('Query', 'posts', {
            ...fi.arguments
        });
    });
}

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
    let cookie = '';
    if (isServer()) {
        cookie = ctx?.req?.headers?.cookie;
    }
    return {
        url: 'http://localhost:4000/graphql',
        fetchOptions: {
            credentials: 'include' as const,
            headers: cookie ? { cookie } : undefined
        },
        exchanges: [
            dedupExchange,
            cacheExchange({
                keys: {
                    PaginatedPosts: () => null
                },
                resolvers: {
                    Query: {
                        posts: cursorPagination()
                    }
                },
                updates: {
                    Mutation: {
                        deletePost: (_result, args, cache, info) => {
                            cache.invalidate({
                                __typename: 'Post',
                                id: (args as DeletePostMutationVariables).id
                            });
                        },
                        vote: (_result, args, cache, info) => {
                            const {
                                postId,
                                value
                            } = args as VoteMutationVariables;
                            const data: any = cache.readFragment(
                                gql`
                                    fragment _ on Post {
                                        id
                                        points
                                        voteStatus
                                    }
                                `,
                                { id: postId }
                            );
                            if (data) {
                                if (data.voteStatus === value) {
                                    return;
                                }
                                const newPoints =
                                    (data.points as number) +
                                    (!data.voteStatus ? 1 : 2) * value;
                                cache.writeFragment(
                                    gql`
                                        fragment __ on Post {
                                            points
                                            voteStatus
                                        }
                                    `,
                                    {
                                        id: postId,
                                        points: newPoints,
                                        voteStatus: value
                                    }
                                );
                            }
                        },
                        createPost: (_result, args, cache, info) => {
                            invalidateAllPosts(cache);
                        },
                        createComment: (_result, args, cache, info) => {
                            cache.invalidate('Query', 'post', {
                                id: (args as CreateCommentMutationVariables)
                                    .input.postId
                            });
                            // cache.
                            // const allFields = cache.inspectFields('Query');
                            // console.log(allFields)
                        },
                        logout: (_result, args, cache, info) => {
                            betterUpdateQuery<LogoutMutation, MeQuery>(
                                cache,
                                { query: MeDocument },
                                _result,
                                (result, query) => ({ me: null })
                            );
                        },
                        login: (_result, args, cache, info) => {
                            betterUpdateQuery<LoginMutation, MeQuery>(
                                cache,
                                { query: MeDocument },
                                _result,
                                (result, query) => {
                                    if (result.login.errors) {
                                        return query;
                                    } else {
                                        return {
                                            me: result.login.user
                                        };
                                    }
                                }
                            );
                            invalidateAllPosts(cache);
                        },
                        register: (_result, args, cache, info) => {
                            betterUpdateQuery<RegisterMutation, MeQuery>(
                                cache,
                                { query: MeDocument },
                                _result,
                                (result, query) => {
                                    if (result.register.errors) {
                                        return query;
                                    } else {
                                        return {
                                            me: result.register.user
                                        };
                                    }
                                }
                            );
                        }
                    }
                }
            }),
            errorExchange,
            ssrExchange,
            multipartFetchExchange
        ]
    };
};
