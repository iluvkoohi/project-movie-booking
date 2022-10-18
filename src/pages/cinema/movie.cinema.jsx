import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, Select, Table, TableCaption, TableContainer, Tbody, Td, Textarea, Th, Thead, Tr, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate, useNavigation } from 'react-router-dom';
import { ModalSpinner } from '../../components/modal.loading';
import { baseUrl, GEOCODE, MAP_API } from '../../const/api';
import { primary } from '../../const/colors';
import { useLocalStorage } from '../../hooks/useLocalstorage.hook';
import CinemaNavbar from './cinema_components/cinema.navbar';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { formatTime } from '../../utils/formatTime.utils';
import imageCompression from 'browser-image-compression';

function CinemaMovies() {

    // React Router Hooks
    const navigate = useNavigate();
    const navigation = useNavigation();

    // React Custom Hooks
    const [localGoogleData, setLocalGoogleData] = useLocalStorage('movie-booking:google');
    const [localUser, setLocalUser] = useLocalStorage('movie-booking:user');

    // React Hooks
    const posterRef = useRef();
    const [address, setAddress] = useState(null);
    const [cinemas, setCinemas] = useState([]);
    const [poster, setPoster] = useState({
        name: "SELECT POSTER",
        file: null
    });

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

    const onAddPoster = (event) => {
        if (event.target.files && event.target.files[0]) {
            setPoster(prev => ({
                ...prev,
                name: event.target.files[0].name,
                file: event.target.files[0]
            }));
        }
    }

    const onCreateMovie = async (props) => {
        if (!poster.file) return posterRef.current.click();

        let { start, end, schedule, cinemaName, title, summary, price, rows, cols } = props;

        if (cols >= 26) return toast({
            title: 'Column maximum is 26',
            status: 'error'
        });

        if (rows >= 27) return toast({
            title: 'Row maximum is 26',
            status: 'error'
        });

        start = parseInt(start.replaceAll(':', ''));
        end = parseInt(end.replaceAll(':', ''));

        const formData = new FormData();
        const compressedFile = await imageCompression(poster.file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true
        });
        formData.append("images", compressedFile)
        const uploadedPoster = await axios.post(baseUrl + '/api/upload', formData);

        const response = await axios.post(baseUrl + '/api/cinema/movie', {
            "cinemaId": localUser.user._id,
            "movie": {
                cinemaName,
                title,
                summary,
                price,
                "poster": uploadedPoster.data,
                "dateTime": { start, end, schedule },
                "seatCount": {
                    rows: parseInt(rows),
                    cols: parseInt(cols)
                }
            }
        });

        return toast({
            title: 'Added successfully!',
            status: 'success'
        });

    }

    const getCreatedCinemas = async (id) => {
        const response = await axios.get(baseUrl + '/api/cinema/' + id);
        setCinemas(response.data);
    }

    // Effects
    useEffect(() => {
        onSyncCurrentLocation();
        getCreatedCinemas(localUser.user._id);

        document.title = `Create Movie | ${process.env.REACT_APP_TITLE}`
    }, [])

    return <React.Fragment>
        <CinemaNavbar title={localGoogleData.profileObj.givenName} />
        <Box mx={{ base: '10', md: '32', lg: '32', xl: '80' }} mt={'10'} mb={'20'} boxShadow={'2xl'} p={10}>

            <form onSubmit={handleSubmit(onCreateMovie)}>
                <FormControl id="cinema_name" isRequired>
                    <FormLabel>Cinema Name</FormLabel>
                    <Select placeholder='Select cinema' {...register("cinemaName", { required: true })}>
                        {cinemas?.map((value) => <option value={value.name} key={value._id}>{value.name}</option>)}
                    </Select>
                </FormControl>

                <FormControl mt={5} id="movie_name" isRequired>
                    <FormLabel>Movie Title</FormLabel>
                    <Input
                        type={'text'}
                        placeholder='Enter'
                        size='md'
                        {...register("title", { required: true })} />
                </FormControl>

                <FormControl mt={5} id="movie_summary" isRequired>
                    <FormLabel>Summary</FormLabel>
                    <Textarea rows={5} {...register("summary", { required: true })}></Textarea>
                </FormControl>

                <Flex mt={5}>
                    <FormControl id="movie_price" mr={5} isRequired>
                        <FormLabel>Movie Price</FormLabel>
                        <Input
                            type={'number'}
                            placeholder='Enter'
                            size='md'
                            {...register("price", { required: true })} />
                    </FormControl>
                    <FormControl id="movie_rows" mr={5} isRequired>
                        <FormLabel>Rows count (5 - 18)</FormLabel>
                        <Input
                            type={'number'}
                            placeholder='Enter'
                            size='md'
                            {...register("rows", { required: true, maxLength: 2, min: 5, max: 18 })} />
                    </FormControl>
                    <FormControl id="movie_cols" isRequired>
                        <FormLabel>Columns count (5 - 18)</FormLabel>
                        <Input
                            type={'number'}
                            placeholder='Enter'
                            size='md'
                            {...register("cols", { required: true, maxLength: 2, min: 5, max: 18 })} />
                    </FormControl>
                </Flex>

                <Flex mt={5}  >
                    <FormControl id="start_time" mr={5} isRequired>
                        <FormLabel>Start time</FormLabel>
                        <Input
                            type={'time'}
                            placeholder='Enter'
                            size='md'
                            {...register("start", { required: true })} />
                    </FormControl>

                    <FormControl id="end_time" mr={5} isRequired>
                        <FormLabel>End time</FormLabel>
                        <Input
                            type={'time'}
                            placeholder='Enter'
                            size='md'
                            {...register("end", { required: true })} />
                    </FormControl>

                    <FormControl id="schedule" isRequired>
                        <FormLabel>Schedule</FormLabel>
                        <Input
                            type={'date'}
                            placeholder='Enter'
                            size='md'
                            {...register("schedule", { required: true })} />
                    </FormControl>
                </Flex>

                <Box mt={5} >
                    <label htmlFor={"posterId"}>
                        <Box backgroundColor={'gray.200'} w={"full"} p={3} borderRadius={"md"} cursor={"pointer"}>
                            <Text
                                color={'gray.700'}
                                textAlign={"center"}
                                fontSize={"smaller"}
                                fontWeight={"medium"}>{poster.name}</Text>
                        </Box>
                    </label>
                    <input
                        type="file"
                        id="posterId"
                        ref={posterRef}
                        accept="image/png, image/jpeg"
                        hidden
                        onChange={onAddPoster} />
                </Box>

                <Button
                    type={'submit'}
                    leftIcon={<AiOutlineCheckCircle />}
                    mt={10}
                    background={primary}
                    color={'white'}
                    isLoading={isSubmitting}>Create</Button>
            </form>
        </Box>
        <ModalSpinner isLoading={navigation.state === 'loading'} />
    </React.Fragment >
}

export default CinemaMovies