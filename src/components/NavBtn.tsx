import { Button } from '@chakra-ui/core';
import React, { FunctionComponent } from 'react';
interface NavBtnProp {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  isLoading?: boolean;
  mr?:string|number;
  colorScheme?:string;
  outline?:boolean;
}
export const NavBtn: FunctionComponent<NavBtnProp> = ({ children, outline = true, ...otherprop}) => {
    return (
        <Button
            variant={outline?'outline':''}
            border='1px solid white'
            borderRadius='5px'
            color='#ffffff'
            _hover={{ color: 'tomato', backgroundColor: '#ffffff' }}
            justifyContent='center'
            {...otherprop}
        >
            {children}
        </Button>
    );
};
