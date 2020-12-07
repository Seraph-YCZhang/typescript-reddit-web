import { Box, Flex, Heading, IconButton, Text } from '@chakra-ui/core';
import { ChatIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react';
import { format } from 'timeago.js';
import { EditDeletePostButtons } from '../../components/EditDeletePostButtons';
import { InputField } from '../../components/InputField';
import { Layout } from '../../components/Layout';
import { useCreateCommentMutation, useMeQuery } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl';

const Post = ({}) => {
    const [{ data, fetching, error }] = useGetPostFromUrl();
    const [openComment, setOpenComment] = useState<boolean>(false);
    const [, createComment] = useCreateCommentMutation();
    const [{ data: meData }] = useMeQuery();
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
            <Text color='GrayText' fontSize='sm'>
                Post by {data.post.creator.username}{' '}
                {format(data.post.createdAt)}
            </Text>
            <Heading size='xl'>{data.post.title}</Heading>

            <Box mt={4} mb={4}>
                {data.post.text}
            </Box>
            <EditDeletePostButtons id={data.post.id} left={true} />
            <Flex alignItems='center'>
                {openComment ? (
                    <IconButton
                        aria-label='close comments'
                        onClick={() => setOpenComment(false)}
                        icon={<ChevronDownIcon />}
                    />
                ) : (
                    <IconButton
                        aria-label='open comments'
                        onClick={() => setOpenComment(true)}
                        icon={<ChevronUpIcon />}
                    />
                )}
                <Box ml={4}>{data.post.comments?.length} comments</Box>
            </Flex>
            {openComment ? (
                <Box boxShadow='0 1px 3px rgba(18,18,18,.1)' padding={4}>
                    <Box>
                        <Formik
                            initialValues={{ text: '' }}
                            onSubmit={async (
                                values,
                                { setErrors, resetForm }
                            ) => {
                                const { error } = await createComment({
                                    input: {
                                        ...values,
                                        postId:
                                            typeof data.post?.id === 'number'
                                                ? data.post?.id
                                                : -1
                                    }
                                });
                                if (!error) {
                                    resetForm({});
                                    window.scrollTo(
                                        0,
                                        document.body.scrollHeight
                                    );
                                }
                            }}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <Box mt={4}>
                                        <InputField
                                            name='text'
                                            placeholder='text...'
                                            label='Body'
                                            textarea
                                        />
                                    </Box>

                                    <IconButton
                                        aria-label='create comment'
                                        type='submit'
                                        icon={<ChatIcon />}
                                        disabled={!meData?.me}
                                        isLoading={isSubmitting}
                                        ml='auto'
                                        display='block'
                                    />
                                </Form>
                            )}
                        </Formik>
                    </Box>
                    {data.post.comments
                        ? data.post.comments.map(comment => {
                              const date: string = format(+comment.createdAt);
                              return (
                                  <Flex ml={4} key={comment.id}>
                                      {/* <UpdootSection post={comment as any} /> */}
                                      <Box flex={1}>
                                          <Flex
                                              justifyContent='space-between'
                                              paddingY={2}
                                          >
                                              <Box
                                                  fontSize='large'
                                                  fontWeight='700'
                                              >
                                                  {comment.creator.username}
                                              </Box>
                                              <Box>{date}</Box>
                                          </Flex>
                                          {/* <hr /> */}
                                          <Box
                                              ml={4}
                                              paddingBottom={2}
                                              minH='4rem'
                                          >
                                              {comment.text}
                                          </Box>
                                          <hr />
                                          {/* <EditDeletePostButtons
                                              id={comment.id}
                                              left={true}
                                          /> */}
                                      </Box>
                                  </Flex>
                              );
                          })
                        : null}
                </Box>
            ) : null}
        </Layout>
    );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
