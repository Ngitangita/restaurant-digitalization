import React from 'react'
import AppRouter from './router/AppRouter'

import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'


const queryClient = new QueryClient();
export default () => (
    <QueryClientProvider client={queryClient}>
        <AppRouter />
    </QueryClientProvider>
)
