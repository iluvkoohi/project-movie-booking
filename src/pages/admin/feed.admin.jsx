import {
    Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Table, TableContainer, Tbody, Td, Th, Thead, Tr,
    Text,
    Tag,
    Avatar,
    TagLabel,
    Spacer,
    Link,
    Switch,
    Flex
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { useLoaderData, useNavigation } from 'react-router-dom';
import { ModalSpinner } from '../../components/modal.loading';
import { useLocalStorage } from '../../hooks/useLocalstorage.hook';
import AdminNavbar from './admin_components/admin.navbar'
import * as dayjs from 'dayjs';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { baseUrl } from '../../const/api';

function AdminFeed() {

    // React Router Hooks
    const loader = useLoaderData();
    const navigation = useNavigation();

    // React Hooks
    const [users, setUsers] = useState([]);

    // Methods 
    const onVerifyUser = async (id, verified) => {
        const response = await axios.put(`${baseUrl}/api/user/verify`, { "_id": id, verified });
        const updatedArray = users.map((value) => {
            if (value._id === response.data._id) value.account.verified = verified;
            return value;
        })
        setUsers(updatedArray);
    }
    useEffect(() => {
        setUsers(loader.data);
    }, [])

    // React Custom Hooks
    const [localGoogleData, setLocalGoogleData] = useLocalStorage('movie-booking:admin:google');

    return <React.Fragment>
        <AdminNavbar title={localGoogleData.givenName} />
        <Box mx={{ base: '2', md: '32', lg: '32', xl: '48' }} mt={'10'} mb={'20'}>
            <Accordion allowMultiple>
                {users?.map((value, index) => {
                    return <AccordionItem key={value._id}>
                        <h2>
                            <AccordionButton>
                                <Tag
                                    size={'lg'}
                                    colorScheme={value.account.verified ? 'green' : 'red'}
                                    borderRadius='full'>
                                    <Avatar
                                        src={value.account.profile.imageUrl}
                                        size='xs'
                                        name={value.account.profile.name}
                                        ml={-1}
                                        mr={2} />
                                    <TagLabel> {value.account.profile.name}</TagLabel>
                                </Tag>
                                <Spacer />
                                <Text
                                    fontSize={'medium'}
                                    color={'gray.600'}
                                    textAlign='left'
                                    mr={'10'}>
                                    {value.email}
                                </Text>
                                <Text
                                    textAlign='left'
                                    fontSize={'medium'}
                                    color={'gray.500'}
                                    mr={'2'}>
                                    {dayjs(value.date.updatedAt).format('MMM DD, YYYY h:mm A')}
                                </Text>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                            <Flex>
                                <Link href={value.account.permitUrl} isExternal>
                                    Business Permit <ExternalLinkIcon mx='2px' />
                                </Link>
                                <Spacer />
                                <Text mr={'2'} lineHeight={1.2} fontWeight={'medium'} color={'gray.400'}>VERIFY USER</Text>
                                <Switch
                                    colorScheme={'purple'}
                                    size={'md'}
                                    onChange={(v) => onVerifyUser(value._id, v.target.checked)}
                                    defaultChecked={value.account.verified} />
                            </Flex>
                        </AccordionPanel>
                    </AccordionItem>
                }).reverse()}
            </Accordion>
        </Box>

        <ModalSpinner isLoading={navigation.state === 'loading'} />
    </React.Fragment>
}

export default AdminFeed