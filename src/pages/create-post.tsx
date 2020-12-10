import { Box, Button, Input } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import React, { useEffect } from 'react';
import { InputField } from '../components/InputField';
import { useCreatePostMutation, useMeQuery } from '../generated/graphql';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { Layout } from '../components/Layout';
import { userIsAuth } from '../utils/useIsAuth';
import Header from '../components/Header';
const createPost: React.FC<{}> = ({}) => {
    const [, createPost] = useCreatePostMutation();
    const router = useRouter();
    userIsAuth();
    return (
        <Layout variant='small'>
            <Header title='create post' />
            <Formik
                initialValues={{ title: '', text: '', file: null }}
                onSubmit={async (values, { setErrors }) => {
                    console.log(values);
                    const { error } = await createPost({ ...values });
                    console.log(error);
                    if (!error) {
                        router.push('/');
                    }
                }}
            >
                {({ values, setFieldValue, isSubmitting }) => (
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
                        <Input
                            type='file'
                            accept='image/*'
                            multiple
                            onChange={({ target: { validity, files } }) => {
                                if (validity.valid && files) {
                                    console.log(files[0]);
                                    setFieldValue('file', files[0]);
                                }
                            }}
                        />

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
