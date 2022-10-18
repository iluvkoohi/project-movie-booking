import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Accordion, keyframes, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Flex, Spacer, Switch, Text, Link, Divider, Button, Image, Stat, StatLabel, StatNumber, StatHelpText } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { useLoaderData, useNavigate, useNavigation } from 'react-router-dom';
import { ModalSpinner } from '../../components/modal.loading'
import { useLocalStorage } from '../../hooks/useLocalstorage.hook';
import * as dayjs from 'dayjs';
import { formatCurrency } from '../../utils/formatTime.utils';
import { ExportJsonCsv } from 'react-export-json-csv';
import AdminNavbar from './admin_components/admin.navbar';

const pulseRing = keyframes`
0% {
    transform: scale(0.33);
}
40%,
50% {
    opacity: 0;
}
100% {
    opacity: 0;
}`;


function AdminMonetizationAndEarnings() {

    // React Router Hooks
    const navigate = useNavigate();
    const navigation = useNavigation();
    const loader = useLoaderData();

    // React Hooks
    const [overAllTotal, setOverAllTotal] = useState(0);
    const [json, setJson] = useState("");
    const [csv, setCsv] = useState("");

    // React Custom Hooks
    const [localGoogleData, setLocalGoogleData] = useLocalStorage('movie-booking:admin:google');
    const [localUser, setLocalUser] = useLocalStorage('movie-booking:user');


    // Methods
    const headers = [
        {
            key: 'poster',
            name: 'Poster',
        },
        {
            key: 'cinema',
            name: 'Cinema',
        },
        {
            key: 'movie',
            name: 'Movie',
        },
        {
            key: 'summary',
            name: 'Movie Summary',
        },
        {
            key: 'price',
            name: 'Ticket Price',
        },
        {
            key: 'customerName',
            name: 'Customer name',
        },
        {
            key: 'customerEmail',
            name: 'Customer email',
        },
        {
            key: 'date',
            name: 'Date',
        },
    ];


    const simplifyData = (record) => {
        let simplified = [];
        for (const data of record) {
            simplified.push({
                poster: data.movie.poster,
                cinema: data.cinema.name,
                movie: data.movie.title,
                summary: data.movie.summary,
                price: data.movie.price - (data.movie.price * process.env.REACT_APP_MONETIZATION),
                customerName: data.customer.name,
                customerEmail: data.customer.email,
                date: data.createdAt,
            });
        }
        return simplified;
    }

    const calculateOverAllTotal = (record) => {
        let sum = 0;
        for (const data of record) {
            sum += data.movie.price * process.env.REACT_APP_MONETIZATION;
        }
        return sum;
    }


    // Effects
    useEffect(() => {
        document.title = `Billing and Payments | ${process.env.REACT_APP_TITLE}`;
    }, [])

    return <React.Fragment>
        <AdminNavbar title={localGoogleData.givenName} />
        <Box mx={{ base: '2', md: '32', lg: '32', xl: '48' }} mt={'10'} mb={'20'}>

            {loader.data.length === 0 ?
                <div></div>
                : <Flex justify={'space-between'} my={'5'} mx={'5'}>
                    <Flex>
                        <Stat mr={'10'}>
                            <StatLabel>Transactions</StatLabel>
                            <StatNumber>{loader.data.length}</StatNumber>
                            <StatHelpText>Year 2022</StatHelpText>
                        </Stat>

                        <Stat>
                            <StatLabel>Monetizations</StatLabel>
                            <StatNumber>{formatCurrency.format(calculateOverAllTotal(loader.data))}</StatNumber>
                            <StatHelpText>Year 2022</StatHelpText>
                        </Stat>
                    </Flex>


                    <ExportJsonCsv
                        headers={headers}
                        items={simplifyData(loader.data)}>
                        <Box
                            fontSize={'sm'}
                            fontWeight={'medium'}
                            background={'gray.200'}
                            p={'5'}
                            borderRadius={'lg'}
                            boxShadow={'lg'}>
                            Export to CSV
                        </Box>
                    </ExportJsonCsv>
                </Flex>}



            <Accordion defaultIndex={[0]} allowMultiple>
                {loader?.data.map((value, index) => {
                    return <AccordionItem key={value._id}>
                        <AccordionButton borderRadius={'lg'} _expanded={{ bg: '#EDF2F7', color: 'black' }}>
                            <Text
                                color={'green.400'}
                                fontWeight={'medium'}
                                mr={'10'}>
                                + {formatCurrency.format(value.movie.price * process.env.REACT_APP_MONETIZATION)}
                            </Text>
                            <Text
                                fontSize={'medium'}
                                mr={'10'}>
                                {value.movie.cinemaName}
                            </Text>
                            <Text
                                fontSize={'medium'}
                                textAlign='left'
                                mr={'10'}>
                                {value.movie.title}
                            </Text>
                            <Spacer />
                            <Link href={value.movie.poster} mr={'5'} isExternal>
                                Poster <ExternalLinkIcon mx='2px' />
                            </Link>
                            <Text
                                textAlign='left'
                                fontSize={'medium'}
                                mr={'2'}>
                                {dayjs(value.movie.dateTime.schedule).format('MMMM DD')}
                            </Text>
                            <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel pb={4}>
                            <Box p={'5'} boxShadow={'lg'} background={'gray.100'} borderRadius={'lg'}>
                                <Flex>
                                    <Image
                                        src={value.movie.poster}
                                        alt={value.movie.poster}
                                        height={'200px'}
                                        borderRadius={'lg'}
                                        mr={'5'} />
                                    <Box>
                                        <Text
                                            fontSize={'medium'}
                                            fontWeight={'medium'}
                                            color={'gray.600'}
                                            textAlign='left'
                                            mr={'10'}>
                                            Transaction # {value.movie._id}
                                        </Text>
                                        <Text
                                            fontSize={'2xl'}
                                            fontWeight={'medium'}
                                            color={'gray.600'}
                                            textAlign='left'>
                                            {value.customer.name}</Text>
                                        <Text
                                            fontSize={'medium'}
                                            color={'gray.600'}
                                            textAlign='left'
                                            mt={'5'}>
                                            Movie: {value.movie.title}
                                        </Text>
                                        <Text
                                            fontSize={'medium'}
                                            color={'gray.600'}>
                                            Cinema: {value.movie.cinemaName}
                                        </Text>
                                        <Text
                                            mt={'5'}
                                            fontSize={'large'}
                                            color={'gray.600'}
                                            textAlign='left'
                                            mr={'10'}>
                                            {formatCurrency.format(value.movie.price - (value.movie.price * process.env.REACT_APP_MONETIZATION))}
                                        </Text>
                                    </Box>
                                </Flex>
                            </Box>
                        </AccordionPanel>
                    </AccordionItem>
                }).reverse()}
            </Accordion>
        </Box>
        <ModalSpinner isLoading={navigation.state === 'loading'} />
    </React.Fragment>
}

export default AdminMonetizationAndEarnings