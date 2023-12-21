import { LoginForm } from '@/components/login/form';
import { withAuth } from '@/components/with-auth';
import React from 'react';

function LoginPage() {
    return (
        <div className='flex justify-center items-center min-h-screen'>
            <LoginForm />
        </div> 
    )
}

export default withAuth(LoginPage, true);