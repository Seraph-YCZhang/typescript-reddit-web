import React from 'react';
import Head from 'next/head';
interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    return (
        <Head>
            <link rel="icon" type="image/png" sizes="32x32" href="/p-32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/p-16.png" />
            <title>postit: {title}</title>
        </Head>
    );
};

export default Header;
