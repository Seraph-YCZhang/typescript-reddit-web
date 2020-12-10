import { Button } from '@chakra-ui/core';
import React, { forwardRef } from 'react';
interface NavBtnProp {
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    isLoading?: boolean;
    mr?: string | number;
    colorScheme?: string;
    outline?: boolean;
}
// @ts-ignore
export const NavBtn: React.FC<NavBtnProp> = forwardRef(
    ({ children, outline = true, ...otherprops }, ref) => {
        return (
            <Button
                ref={ref as any}
                variant={outline ? 'outline' : ''}
                border='1px solid white'
                borderRadius='5px'
                color='#ffffff'
                _hover={{ color: 'tomato', backgroundColor: '#ffffff' }}
                justifyContent='center'
                {...otherprops}
            >
                {children}
            </Button>
        );
    }
);
