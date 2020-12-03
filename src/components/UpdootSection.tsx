import { Flex, IconButton } from '@chakra-ui/core';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql';

interface UpdootSectionProps {
    post: PostSnippetFragment;
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
    const [loadingState, setLoadingState] = useState<
        'updoot-loading' | 'downdoot-loading' | 'not-loading'
    >('not-loading');
    const [, vote] = useVoteMutation();
    return (
        <Flex
            mr={4}
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
        >
            <IconButton
                aria-label='upvote'
                icon={<TriangleUpIcon />}
                colorScheme={post.voteStatus === 1 ? 'green' : undefined}
                onClick={async () => {
                    if (post.voteStatus === 1) return;
                    setLoadingState('updoot-loading');
                    await vote({
                        postId: post.id,
                        value: 1
                    });
                    setLoadingState('not-loading');
                }}
                isLoading={loadingState === 'updoot-loading'}
            />
            {post.points}
            <IconButton
                aria-label='downvote'
                icon={<TriangleDownIcon />}
                colorScheme={post.voteStatus === -1 ? 'red' : undefined}
                onClick={async () => {
                    if (post.voteStatus === -1) return;
                    setLoadingState('downdoot-loading');
                    await vote({
                        postId: post.id,
                        value: -1
                    });
                    setLoadingState('not-loading');
                }}
                isLoading={loadingState === 'downdoot-loading'}
            />
        </Flex>
    );
};
