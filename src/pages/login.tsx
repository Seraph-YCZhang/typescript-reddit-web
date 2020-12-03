import {
    Box,
    Button,

    Flex, Link
} from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/dist/client/router';
import NextLink from 'next/link';
import React from 'react';
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
// import { useMutation } from 'urql';
import { useLoginMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { toErrorMap } from '../utils/toErrorMap';

const Login: React.FC<{}> = ({}) => {
    const [, login] = useLoginMutation();
    const router = useRouter();
    return (
        <Wrapper variant='small'>
            <Formik
                initialValues={{ usernameOrEmail: '', password: '' }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await login(values);
                    if (response.data?.login.errors) {
                        setErrors(toErrorMap(response.data.login.errors));
                    } else if (response.data?.login.user) {
                        if (typeof router.query.next === 'string') {
                            router.push(router.query.next);
                        } else {
                            router.push('/');
                        }
                    }
                }}
            >
                {({ values, handleChange, isSubmitting }) => (
                    <Form>
                        <InputField
                            name='usernameOrEmail'
                            placeholder='username or email'
                            label='Username or Email'
                        />
                        <Box mt={4}>
                            <InputField
                                name='password'
                                placeholder='password'
                                label='Password'
                                type='password'
                            />
                        </Box>
                        <Flex mt={2}>
                            <NextLink href='/forgot-password'>
                                <Link ml={'auto'}>
                                    Forgot password? Click here.
                                </Link>
                            </NextLink>
                        </Flex>
                        <Button
                            mt={4}
                            type='submit'
                            colorScheme='teal'
                            isLoading={isSubmitting}
                        >
                            Login
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
};

export default withUrqlClient(createUrqlClient)(Login);
