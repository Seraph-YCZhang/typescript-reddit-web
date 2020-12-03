import { Box, Heading } from '@chakra-ui/core';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { EditDeletePostButtons } from '../../components/EditDeletePostButtons';
import { Layout } from '../../components/Layout';
import { usePostQuery } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl';

const Post = ({}) => {
    const [{ data, fetching, error }] = useGetPostFromUrl()
    if (fetching) {
        return (
            <Layout>
                <div>Loading...</div>
            </Layout>
        );
    }
    if (error) {
        return <Box>{error.message}</Box>;
    }
    if (!data?.post) {
        return (
            <Layout>
                <Box>Could not find post</Box>
            </Layout>
        );
    }
    return (
        <Layout>
            <Heading size='xl'>{data.post.title}</Heading>
            <Box mt={4} mb={4}>{data.post.text}</Box>
            <EditDeletePostButtons id={data.post.id} />
        </Layout>
    );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
