import { Box, Image, Wrap, Text, Tooltip, WrapItem, Skeleton, useDisclosure } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useNavigation } from 'react-router-dom';
import { ModalInputUrl } from '../../components/modal.input-url';
import { ModalSpinner } from '../../components/modal.loading';
import { baseUrl } from '../../const/api';
import { primary } from '../../const/colors';
import { useLocalStorage } from '../../hooks/useLocalstorage.hook';
import CinemaNavbar from './cinema_components/cinema.navbar'

function CinemaFeed() {

    // React Router Hooks
    const navigate = useNavigate();
    const navigation = useNavigation();

    // React Hooks
    const [movies, setMovies] = useState(null);

    // React Custom Hooks
    const [localGoogleData, setLocalGoogleData] = useLocalStorage('movie-booking:google');
    const [localUser, setLocalUser] = useLocalStorage('movie-booking:user');

    // Others
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Methods
    const getMovies = async (id) => {
        const response = await axios.get(baseUrl + '/api/cinema/movie/' + id);
        setMovies(response.data);
    }

    // Effects
    useEffect(() => {
        getMovies(localUser.user._id);
        document.title = `Movies | ${process.env.REACT_APP_TITLE}`
    }, []);

    return <React.Fragment>
        <CinemaNavbar title={localGoogleData.profileObj.givenName} />
        <Box mx={{ base: '2', md: '32', lg: '32', xl: '48' }} mt={'10'} mb={'20'}>
            {!movies && <Wrap justify={'center'} spacing={5}>
                {[...Array(20).keys()].map((v) => {
                    return <WrapItem key={v}>
                        <Box>
                            <Skeleton height={'300px'} width={'200px'} borderRadius={'lg'} />
                            <Skeleton height={'10px'} width={'200px'} borderRadius={'lg'} mt={'2'} />
                            <Skeleton height={'10px'} width={'150px'} borderRadius={'lg'} mt={'2'} />
                        </Box>
                    </WrapItem>
                })}
            </Wrap>}
            <Wrap justify={'center'} spacing={5}>
                {movies?.map((value) => {
                    return <WrapItem
                        cursor={'pointer'}
                        onClick={() => navigate(`/preview/${value.movie._id}`, { state: value })}
                        position={'relative'}
                        key={value.movie._id}>
                        <Box width={{ base: '350px', md: '200px' }}>
                            <Tooltip label={value.movie.title} placement={'top'} key={value.movie._id} hasArrow>
                                <Box
                                    position={'absolute'}
                                    background={primary}
                                    color={'white'}
                                    p={5}
                                    borderRadius={'lg'}
                                    fontSize={'small'}>
                                    {value.seats.seats.filter((el) => !el.occupied).length} / {value.seats.seats.length}
                                </Box>
                            </Tooltip>
                            <Image
                                src={value.movie.poster}
                                height={{ base: '480px', md: '300px' }}
                                width={'full'}
                                fit={'cover'}
                                borderRadius={'lg'} />
                            <Tooltip label={value.movie.title} hasArrow>
                                <Text
                                    mt={'2'}
                                    fontWeight={'medium'}
                                    noOfLines={2}
                                    textOverflow={'ellipsis'}
                                    fontSize={'sm'}> {value.movie.title}</Text>
                            </Tooltip>
                        </Box>
                    </WrapItem>
                })}
            </Wrap>
        </Box>
        <ModalInputUrl isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
        <ModalSpinner isLoading={navigation.state === 'loading'} />
    </React.Fragment>
}

export default CinemaFeed