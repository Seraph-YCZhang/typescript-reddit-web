import {
    Box,
    Button,
    Flex,
    Heading,
    Input,
    Link,
    Stack,
    Text
} from '@chakra-ui/core';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { EditDeletePostButtons } from '../components/EditDeletePostButtons';
import { Layout } from '../components/Layout';
import { UpdootSection } from '../components/UpdootSection';
import { useMeQuery, usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { format } from 'timeago.js';
import Header from '../components/Header';
const Index = () => {
    const [variables, setVariables] = useState({
        limit: 15,
        cursor: null as null | string,
        filter: null as null | string
    });
    const [{ data: meData }] = useMeQuery();
    const [{ data, error, fetching }] = usePostsQuery({
        variables
    });

    if (!fetching && !data) {
        return (
            <div>
                <div>you got query failed</div>
                <div>{error?.message}</div>
            </div>
        );
    }
    return (
        <>
            <Flex
                position='absolute'
                height={450}
                zIndex={2}
                top={-150}
                width='100%'
                align='center'
            >
                <Box
                    height='100%'
                    transform='skewY(-10deg)'
                    position='absolute'
                    background='tomato'
                    width='100%'
                />
                <Box
                    pos='relative'
                    top='20px'
                    alignSelf='flex-end'
                    ml={[10, 20]}
                    color='#3a3a3a'
                    fontSize={['42px', '72px', '86px']}
                    fontWeight='700'
                >
                    Post something you want to share
                </Box>
            </Flex>
            <Layout>
                <Header title='the front page of posts' />

                <br />

                {!data && fetching ? (
                    <div>Loading...</div>
                ) : (
                    <Box mt={280}>
                        <Input
                            value={variables.filter ? variables.filter : ''}
                            onChange={e => {
                                setVariables({
                                    ...variables,
                                    filter:
                                        e.target.value.length > 0
                                            ? e.target.value
                                            : null
                                });
                            }}
                            mb={4}
                            placeholder='Search...'
                        />
                        <Stack spacing={8}>
                            {data!.posts.posts.map(p => {
                                const date: string = format(+p.createdAt);
                                return !p ? null : (
                                    <Flex
                                        key={p.id}
                                        p={5}
                                        shadow='md'
                                        borderWidth='1px'
                                    >
                                        <UpdootSection post={p} />
                                        <Box flex={1}>
                                            <Text
                                                color='GrayText'
                                                fontSize='sm'
                                            >
                                                Post by {p.creator.username}{' '}
                                                {date}
                                            </Text>
                                            <NextLink
                                                href='/post/[id]'
                                                as={`/post/${p.id}`}
                                            >
                                                <Link>
                                                    <Heading fontSize='xl'>
                                                        {p.title}
                                                    </Heading>
                                                </Link>
                                            </NextLink>

                                            <Flex flex={1} align='center'>
                                                <Text>{p.textSnippet}</Text>
                                                {meData?.me?.id !==
                                                p.creator.id ? null : (
                                                    <Box ml='auto'>
                                                        <EditDeletePostButtons
                                                            id={p.id}
                                                            left={false}
                                                        />
                                                    </Box>
                                                )}
                                            </Flex>
                                        </Box>
                                    </Flex>
                                );
                            })}
                        </Stack>
                    </Box>
                )}
                {data && data.posts.hasMore ? (
                    <Flex>
                        <Button
                            onClick={() => {
                                console.log(
                                    data.posts.posts[
                                        data.posts.posts.length - 1
                                    ].createdAt
                                );
                                setVariables({
                                    filter:
                                        typeof variables.filter === 'string' &&
                                        variables.filter.length > 0
                                            ? variables.filter
                                            : null,
                                    limit: variables.limit,
                                    cursor:
                                        data.posts.posts[
                                            data.posts.posts.length - 1
                                        ].createdAt
                                });
                            }}
                            isLoading={fetching}
                            m='auto'
                            my={8}
                        >
                            Load more
                        </Button>
                    </Flex>
                ) : null}
            </Layout>
        </>
    );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
