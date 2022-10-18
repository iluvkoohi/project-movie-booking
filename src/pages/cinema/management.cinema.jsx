import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, Table, TableCaption, TableContainer, Tbody, Td, Textarea, Th, Thead, Tr, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate, useNavigation } from 'react-router-dom';
import { ModalSpinner } from '../../components/modal.loading';
import { baseUrl, GEOCODE, MAP_API } from '../../const/api';
import { primary } from '../../const/colors';
import { useLocalStorage } from '../../hooks/useLocalstorage.hook';
import CinemaNavbar from './cinema_components/cinema.navbar';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { formatTime } from '../../utils/formatTime.utils';


function CinemaManagment() {

    // React Router Hooks
    const navigate = useNavigate();
    const navigation = useNavigation();

    // React Custom Hooks
    const [localGoogleData, setLocalGoogleData] = useLocalStorage('movie-booking:google');
    const [localUser, setLocalUser] = useLocalStorage('movie-booking:user');

    // React Hooks
    const [address, setAddress] = useState(null);
    const [cinemas, setCinemas] = useState([]);
    const [loading, setLoading] = useState(false);


    // Others
    const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm();
    const toast = useToast();


    // Methods
    const onSyncCurrentLocation = async () => {
        navigator.geolocation.getCurrentPosition(async (position) => {
            if (position) {
                const { coords: { latitude, longitude } } = position;
                const { data: { results } } = await axios.get(`${GEOCODE}?latlng=${latitude},${longitude}&key=${MAP_API}`);
                for (let address of results) {
                    if (!address.formatted_address.includes("+")) {
                        setValue("address", address.formatted_address);
                        setAddress({
                            name: address.formatted_address,
                            coordinates: { latitude, longitude }
                        })
                        break;
                    }
                }
            }
        }, (err) => { }, { maximumAge: 60000, timeout: 5000, enableHighAccuracy: true })
    }

    const getCreatedCinemas = async (id) => {
        const response = await axios.get(baseUrl + '/api/cinema/' + id);
        setCinemas(response.data);
    }

    const onCreateCinema = async ({ name, open, close }) => {
        try {
            open = parseInt(open.replaceAll(':', ''));
            close = parseInt(close.replaceAll(':', ''));

            await axios.post(baseUrl + '/api/cinema', {
                "cinemaId": localUser.user._id,
                name: name.trim(),
                address,
                "dateTime": { open, close }
            });

            await getCreatedCinemas(localUser.user._id);
        } catch (error) {
            if (error.response.status === 400) {
                return toast({
                    title: `${name} already exist`,
                    status: 'error'
                });
            }
        }
    }

    const onDeleteCinema = async (id) => {
        setLoading(true);
        await axios.delete(baseUrl + '/api/cinema/' + id);
        await getCreatedCinemas(localUser.user._id);
        setLoading(false);
    }


    // Effects
    useEffect(() => {
        onSyncCurrentLocation();
        getCreatedCinemas(localUser.user._id);
        document.title = `Create Cinema | ${process.env.REACT_APP_TITLE}`;
    }, [])

    return <React.Fragment>
        <CinemaNavbar title={localGoogleData.profileObj.givenName} />

        <Box mx={{ base: '10', md: '32', lg: '32', xl: '80' }} mt={'10'} mb={'20'} boxShadow={'2xl'} p={10}>
            <form onSubmit={handleSubmit(onCreateCinema)}>
                <FormControl id="cinema_name" isRequired>
                    <FormLabel>Cinema Name</FormLabel>
                    <Input
                        type={'text'}
                        placeholder='Enter'
                        size='md'
                        {...register("name", { required: true })} />
                </FormControl>

                <FormControl mt={5} id="cinema_address" isRequired>
                    <FormLabel>Cinema address</FormLabel>
                    <Textarea rows={3} {...register("address")} disabled></Textarea>
                </FormControl>

                <Flex mt={5}  >
                    <FormControl id="open_time" mr={5} isRequired>
                        <FormLabel>Open time</FormLabel>
                        <Input
                            type={'time'}
                            placeholder='Enter'
                            size='md'
                            {...register("open", { required: true })} />
                    </FormControl>

                    <FormControl id="closing_time" isRequired>
                        <FormLabel>Closing time</FormLabel>
                        <Input
                            type={'time'}
                            placeholder='Enter'
                            size='md'
                            {...register("close", { required: true })} />
                    </FormControl>
                </Flex>
                <Button
                    type={'submit'}
                    leftIcon={<AiOutlineCheckCircle />}
                    mt={10}
                    background={primary}
                    color={'white'}
                    isLoading={isSubmitting}>Create</Button>
            </form>

            {cinemas.length !== 0 && <Box>
                <Heading mt={'20'} size={'md'}>Cinemas</Heading>
                <TableContainer mt={'5'}>
                    <Table variant='striped' colorScheme='blackAlpha'>
                        <Thead>
                            <Tr>
                                <Th>#</Th>
                                <Th>Name</Th>
                                <Th>Schedule</Th>
                                <Th>Action</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {cinemas?.map((value, index) => {
                                String.prototype.splice = function (idx, rem, str) {
                                    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
                                };

                                let parsedOpen;
                                let parsedClose;

                                let open = value.dateTime.open.toString();
                                let close = value.dateTime.close.toString();

                                if (open.length >= 3) parsedOpen = formatTime(open.splice(1, 0, ":"));
                                if (open.length >= 4) parsedOpen = formatTime(open.splice(2, 0, ":"));
                                if (close.length >= 3) parsedClose = formatTime(close.splice(1, 0, ":"));
                                if (close.length >= 4) parsedClose = formatTime(close.splice(2, 0, ":"));

                                return <Tr key={value._id}>
                                    <Td>{index + 1}</Td>
                                    <Td>{value.name}</Td>
                                    <Td>{parsedOpen} - {parsedClose}</Td>
                                    <Td>
                                        <Button colorScheme={"red"} onClick={() => onDeleteCinema(value._id)}>Delete</Button>
                                    </Td>
                                </Tr>
                            })}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>}
        </Box>

        <ModalSpinner isLoading={navigation.state === 'loading' || loading} />
    </React.Fragment>
}

export default CinemaManagment