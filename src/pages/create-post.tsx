import { Box, Button } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import React, { useEffect } from 'react';
import { InputField } from '../components/InputField';
import { useCreatePostMutation, useMeQuery } from '../generated/graphql';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { Layout } from '../components/Layout';
import { userIsAuth } from '../utils/useIsAuth';
const createPost: React.FC<{}> = ({}) => {
    const [, createPost] = useCreatePostMutation();
    const router = useRouter();
    userIsAuth();
    return (
        <Layout variant='small'>
            <Formik
                initialValues={{ title: '', text: '' }}
                onSubmit={async (values, { setErrors }) => {
                    const { error } = await createPost({ input: values });
                    if (!error) {
                        router.push('/');
                    }
                }}
            >
                {({ values, handleChange, isSubmitting }) => (
                    <Form>
                        <InputField
                            name='title'
                            placeholder='title'
                            label='Title'
                        />
                        <Box mt={4}>
                            <InputField
                                name='text'
                                placeholder='text...'
                                label='Body'
                                textarea
                            />
                        </Box>

                        <Button
                            mt={4}
                            type='submit'
                            colorScheme='teal'
                            isLoading={isSubmitting}
                        >
                            Create Post
                        </Button>
                    </Form>
                )}
            </Formik>
        </Layout>
    );
};

export default withUrqlClient(createUrqlClient)(createPost);
