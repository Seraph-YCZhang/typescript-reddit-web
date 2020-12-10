import {
    Box,
    Button,
    Flex,
    Icon,
    Menu,
    MenuButton,
    MenuItem,
    MenuList
} from '@chakra-ui/core';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import React from 'react';
import { IoIosExit } from 'react-icons/io';
import { CgProfile } from 'react-icons/cg';
import { useLogoutMutation, User } from '../generated/graphql';

interface NavProfileProps {
    me:
        | ({
              __typename?: 'User' | undefined;
          } & {
              __typename?: 'User' | undefined;
          } & Pick<User, 'id' | 'username'>)
        | null
        | undefined;
}

export const NavProfile: React.FC<NavProfileProps> = ({ me }) => {
    const router = useRouter();
    const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
    return (
        <Menu>
            <MenuButton
                color='#ffffff'
                bgColor='tomato'
                border='1px solid tomato'
                _hover={{ bgColor: 'tomato', borderColor: '#ffffff' }}
                _active={{ outline: 0, bgColor: 'tomato', borderColor: '#ffffff' }}
                as={Button}
                rightIcon={<ChevronDownIcon />}
                _focus={{ outline: 0, boxShadow: 'outline' }}
                p={[1/4,1/2,1]}
            >
                <Icon as={CgProfile} mr={4} w={6} h={6}/>
                {me?.username}
            </MenuButton>
            <MenuList>
                <MenuItem
                    onClick={async () => {
                        await logout();
                        router.reload();
                    }}
                    as='button'
                    isDisabled={logoutFetching}
                >
                    <Flex align='center'>
                        <Icon as={IoIosExit} mr={4} />
                        Log out
                    </Flex>
                </MenuItem>
            </MenuList>
        </Menu>
    );
};
