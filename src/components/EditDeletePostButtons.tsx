import { Box, IconButton, Link } from '@chakra-ui/core';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import React from 'react';
import NextLink from 'next/link';
import { useDeletePostMutation } from '../generated/graphql';
interface EditDeletePostButtonsProps {
    id: number;
    left: boolean;
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
    id,
    left
}) => {
    const [, deletePost] = useDeletePostMutation();
    return (
        <Box textAlign={left ? 'end' : 'start'}>
            <NextLink href='/post/edit/[id]' as={`/post/edit/${id}`}>
                <IconButton
                    mr={2}
                    as={Link}
                    icon={<EditIcon />}
                    aria-label='update post'
                />
            </NextLink>
            <IconButton
                icon={<DeleteIcon />}
                colorScheme='red'
                aria-label='delete post'
                onClick={() => deletePost({ id })}
            />
        </Box>
    );
};
