import { Box, Button, Flex, Heading, Link } from '@chakra-ui/core';
import React from 'react';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';
import { useRouter } from 'next/router';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
    const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
    const [{ data, fetching }] = useMeQuery();
    const router = useRouter();
    let body = null;
    if (fetching) {
        body = null;
    } else if (!data?.me) {
        body = (
            <>
                <NextLink href='/login'>
                    <Link mr={2} color='white'>
                        Login
                    </Link>
                </NextLink>
                <NextLink href='/register'>
                    <Link color='white'>Register</Link>
                </NextLink>
            </>
        );
    } else {
        body = (
            <Flex alignItems='center'>
                <NextLink href='/create-post'>
                    <Link mr={4} as='button'>create post</Link>
                </NextLink>
                <Box mr={2}>{data.me.username}</Box>
                <Button
                    onClick={async () => {
                        await logout();
                        router.reload();
                    }}
                    variant='link'
                    isLoading={logoutFetching}
                >
                    loggout
                </Button>
            </Flex>
        );
    }
    return (
        <Flex
            bg='tomato'
            p={4}
            pos='sticky'
            top={0}
            zIndex={1}
            alignItems='center'
        >
            <Flex alignItems='center' maxW={800} flex={1} m='auto'>
            <NextLink href='/'>
                <Link>
                    <Heading>Reddit</Heading>
                </Link>
            </NextLink>
            <Box ml={'auto'}>{body}</Box>
            </Flex>
        </Flex>
    );
};
