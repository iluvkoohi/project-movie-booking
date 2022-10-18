import { Box, Button, Flex, Heading, SimpleGrid, Tooltip, Wrap, WrapItem, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { primary } from '../../const/colors';
import { useLocalStorage } from '../../hooks/useLocalstorage.hook';
import CinemaNavbar from './cinema_components/cinema.navbar'
import { BiChair } from 'react-icons/bi';
import { ModalSpinner } from '../../components/modal.loading';
import { baseUrl } from '../../const/api';
import { AiOutlineDelete } from 'react-icons/ai'
import * as dayjs from 'dayjs';
import axios from 'axios';

function MoviePreview() {

    // React Router Hooks
    const { state: { seats, movie }, } = useLocation();
    const navigate = useNavigate();

    // React Custom Hooks
    const [localGoogleData, setLocalGoogleData] = useLocalStorage('movie-booking:google');
    const [localUser, setLocalUser] = useLocalStorage('movie-booking:user');

    // React Hooks
    const [loading, setLoading] = useState(false);

    // Methods
    const onDeleteMovie = async (id) => {
        setLoading(true);
        await axios.delete(baseUrl + '/api/cinema/movie/' + id);
        setLoading(false);
        navigate(`/me/${localUser.user._id}`, { replace: true });
    }

    // Effects
    useEffect(() => {
        document.title = `${movie.title}  | ${process.env.REACT_APP_TITLE}`
    }, [])

    return <React.Fragment>
        <Box
            style={{
                position: 'fixed',
                zIndex: 1,
                display: 'block',
                backgroundSize: 'cover',
                width: '100%',
                height: ' 100vh',
                WebkitFilter: 'blur(3px)',
                filter: 'blur(3px)',
                backgroundImage: `linear-gradient(180deg, rgba(15,11,19,1) 0%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.6727065826330532) 73%, rgba(255,255,255,0.5942752100840336) 100%), url(${movie.poster})`,
            }}>
        </Box>

        <Box style={{ position: 'absolute', zIndex: 999 }} width={'full'}>
            <CinemaNavbar title={localGoogleData.profileObj.givenName} />
            <Box px={'10'} pt={'5'} pb={'20'} >
                <Flex justify={'space-between'} align={'start'}>
                    <Heading size={{ base: 'lg', md: 'lg' }}>{movie.cinemaName}</Heading>
                    {seats.seats.filter((el) => !el.occupied).length === seats.seats.length &&
                        <Button
                            size={{ base: 'sm', md: 'lg' }}
                            colorScheme={'red'}
                            leftIcon={<AiOutlineDelete />}
                            onClick={() => onDeleteMovie(movie._id)}>Delete</Button>}
                </Flex>

                <SimpleGrid columns={{ base: 1, md: seats.cols }} spacing={2} mt={5}>
                    {seats.seats.map((value) => {
                        return <Tooltip
                            label={value.customer === 'none' ? 'Vacant' : value.customer}
                            bg={'orange.400'}
                            hasArrow
                            key={value.seat}>
                            <Box
                                position={'relative'}
                                background={value.occupied ? 'red.400' : primary}
                                color={'white'}
                                p={seats.cols <= 10 ? 10 : 3}
                                borderRadius={'md'}
                                textAlign={'center'}
                                fontWeight={'bold'}
                                opacity={0.7}>
                                <Box position={'absolute'} mt={'-2'} ml={'-2'}>
                                    <BiChair opacity={0.4} />
                                </Box>
                                {value.seat}
                            </Box>
                        </Tooltip>
                    })}
                </SimpleGrid>
                <Text
                    mt={'14'}
                    width={{ base: '200px', md: '500px' }}
                    fontSize={{ base: 'xs', md: 'lg' }}
                    color={'black'}
                    fontWeight={'bold'}>{movie.title} - {dayjs(movie.dateTime.schedule).format('MMMM D, YYYY')}</Text>
                <Text
                    display={{ base: 'none', md: 'flex' }}
                    width={{ base: '200px', md: '500px' }}
                    fontSize={{ base: 'xs', md: 'medium' }}
                    color={'black'}
                    fontWeight={'normal'}>{movie.summary}</Text>
            </Box>

        </Box>
        <ModalSpinner isLoading={loading} />
    </React.Fragment >
}

export default MoviePreview