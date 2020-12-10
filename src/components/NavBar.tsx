import { Box, Button, Flex, Heading, IconButton, Link } from '@chakra-ui/core';
import { ChatIcon, ChevronDownIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { NavBtn } from './NavBtn';
import { NavProfile } from './NavProfile';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {

    const [{ data, fetching }] = useMeQuery();

    let body = null;
    if (fetching) {
        body = null;
    } else if (!data?.me) {
        body = (
            <>
                <NextLink href='/login'>
                    <NavBtn mr={4}>
                        <Link color='white'>Sign In</Link>
                    </NavBtn>
                </NextLink>
                <NextLink href='/register'>
                    <NavBtn colorScheme='blue' outline={false}>
                        <Link color='white'>Sign Up</Link>
                    </NavBtn>
                </NextLink>
            </>
        );
    } else {
        body = (
            <Flex alignItems='center'>
                <NextLink href='/create-post'>
                    <NavBtn mr={4}>
                        <Link>Create Post</Link>
                    </NavBtn>
                </NextLink>
                <NavProfile me={data.me}/>
            </Flex>
        );
    }
    return (
        <Flex
            bg='tomato'
            p={4}
            pos='sticky'
            top={0}
            zIndex={3}
            alignItems='center'
        >
            
            <Flex alignItems='center' maxW={800} flex={1} m='auto'>
                <NextLink href='/'>
                    <Link>
                        <Heading>
                            <Flex alignItems='center' color='#fff' fontFamily='cursive'>
                                <ChatIcon mr={4} color='#fff'/>
                                postit!
                            </Flex>
                        </Heading>
                    </Link>
                </NextLink>
                <Box ml={'auto'}>{body}</Box>
            </Flex>
        </Flex>
    );
};
