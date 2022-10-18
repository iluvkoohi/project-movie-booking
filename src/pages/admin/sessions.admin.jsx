import React from 'react'
import { useNavigation } from 'react-router-dom';
import { ModalSpinner } from '../../components/modal.loading';
import { useLocalStorage } from '../../hooks/useLocalstorage.hook';
import AdminNavbar from './admin_components/admin.navbar';
import { Box, Heading, Text } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
function AdminUserSessions() {

    // React Router Hooks
    const navigation = useNavigation();

    // React Custom Hooks
    const [localGoogleData, setLocalGoogleData] = useLocalStorage('movie-booking:admin:google');

    return <React.Fragment>
        <AdminNavbar title={localGoogleData.givenName} />
        <Box textAlign="center" py={10} px={6} mt={'32'}>
            <CheckCircleIcon boxSize={'50px'} color={'green.500'} />
            <Heading as="h2" size="xl" mt={6} mb={2}>
                Cooming soon!
            </Heading>
            <Text color={'gray.500'} mt={'5'}>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy<br />
                eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam<br />
                voluptua.
            </Text>
        </Box>
        <ModalSpinner isLoading={navigation.state === 'loading'} />
    </React.Fragment>;
}

export default AdminUserSessions