import { Box, Button, Flex, Link } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/dist/client/router';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { InputField } from '../../components/InputField';
import { Wrapper } from '../../components/Wrapper';
import { useChangPasswordMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { toErrorMap } from '../../utils/toErrorMap';

const ChangePassword: React.FC<{}> = () => {
    const [, changePassword] = useChangPasswordMutation();
    const router = useRouter();
    const [tokenError, setTokenError] = useState('');
    return (
        <Wrapper variant='small'>
            <Formik
                initialValues={{ newPassword: '' }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await changePassword({
                        newPassword: values.newPassword,
                        token:
                            typeof router.query.token === 'string'
                                ? router.query.token
                                : ''
                    });
                    // const response = await login(values);
                    if (response.data?.changePassword.errors) {
                        const errorMap = toErrorMap(
                            response.data.changePassword.errors
                        );
                        if ('token' in errorMap) {
                            setTokenError(errorMap.token);
                        }
                        setErrors(errorMap);
                    } else if (response.data?.changePassword.user) {
                        router.push('/');
                    }
                }}
            >
                {({ values, handleChange, isSubmitting }) => (
                    <Form>
                        <InputField
                            name='newPassword'
                            placeholder='new password'
                            label='New Password'
                            type='password'
                        />
                        {tokenError && (
                            <Flex>
                                <Box mr={2} color='red'>
                                    {tokenError}
                                </Box>
                                <NextLink href='/forgot-password'>
                                    <Link>click here to get a new one</Link>
                                </NextLink>
                            </Flex>
                        )}
                        <Button
                            mt={4}
                            type='submit'
                            colorScheme='teal'
                            isLoading={isSubmitting}
                        >
                            Change Password
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
};

export default withUrqlClient(createUrqlClient)(ChangePassword);
