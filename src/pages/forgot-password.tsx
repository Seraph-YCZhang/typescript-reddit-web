import { Box, Flex, Link, Button } from '@chakra-ui/core';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react';
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { createUrqlClient } from '../utils/createUrqlClient';
import { toErrorMap } from '../utils/toErrorMap';
import login from './login';
import NextLink from 'next/link';
import { useRouter } from 'next/dist/client/router';
import {
    useForgotPasswordMutation,
    useLoginMutation
} from '../generated/graphql';

const ForgotPassword: React.FC<{}> = ({}) => {
    const [, forgotPassword] = useForgotPasswordMutation();
    const [complete, setComplete] = useState(false);
    return (
        <Wrapper variant='small'>
            <Formik
                initialValues={{ email: '' }}
                onSubmit={async (values, { setErrors }) => {
                    await forgotPassword(values);
                    setComplete(true);
                }}
            >
                {({ values, handleChange, isSubmitting }) =>
                    complete ? (
                        <Box>
                            if an account with that email exists, we sent you an
                            email
                        </Box>
                    ) : (
                        <Form>
                            <InputField
                                name='email'
                                placeholder='email'
                                label='Email'
                                type='email'
                            />

                            <Button
                                mt={4}
                                type='submit'
                                colorScheme='teal'
                                isLoading={isSubmitting}
                            >
                                forgot password
                            </Button>
                        </Form>
                    )
                }
            </Formik>
        </Wrapper>
    );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
