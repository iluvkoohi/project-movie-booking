import React, { useEffect, useState } from 'react'
import { GoogleLogin, useGoogleLogout } from 'react-google-login'
import { clientId } from '../../../const/google.signin';
import { gapi } from 'gapi-script'
import { Box, Button, Flex, Heading, Text, useDisclosure, useToast } from '@chakra-ui/react';
import backgroundImg from '../../../images/background.jpg';
import axios from 'axios';
import { baseUrl } from '../../../const/api';
import { useLocalStorage } from '../../../hooks/useLocalstorage.hook';
import { useNavigate, useNavigation } from 'react-router-dom';
import { ModalSpinner } from '../../../components/modal.loading';
import { primary } from '../../../const/colors';
import { ModalInputUrl } from '../../../components/modal.input-url';
import { userState } from '../../../state/profile';
import { useRecoilState } from 'recoil';


function CinemaLogin() {

    // React Router Hooks
    const navigate = useNavigate();
    const navigation = useNavigation();

    // React Hooks
    const [user, setUser] = useRecoilState(userState);
    const [loading, setLoading] = useState(false);

    // React Custom Hooks
    const [localGoogleData, setLocalGoogleData] = useLocalStorage('movie-booking:google');
    const [localUser, setLocalUser] = useLocalStorage('movie-booking:user');

    // Others
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { signOut, loaded } = useGoogleLogout({
        clientId,
        cookiePolicy: 'single_host_origin',

    })

    // Methods
    const onSuccess = async ({ googleId, profileObj }) => {

        // Clear first
        localStorage.removeItem("movie-booking:google");
        localStorage.removeItem("movie-booking:user");

        setLoading(true);

        let { email, imageUrl, familyName, givenName, name } = profileObj;
        const payload = {
            email,
            "password": googleId,
            "account": {
                "profile": {
                    imageUrl,
                    familyName: familyName ??= "N/A",
                    givenName: givenName ??= "N/A",
                    name
                }
            }
        };


        await axios.post(`${baseUrl}/api/user/login`, { email: payload.email, password: payload.password })
            .then(async (value) => {

                setUser(value.data); // assign to global state
                setLocalUser(value.data);
                setLocalGoogleData({ googleId, profileObj });

                if (value.data.user.account.permitUrl && !value.data.user.account.verified) return toast({
                    "title": "ONGOING REVIEW",
                    "description": `Hi, ${givenName ??= familyName}. We're still reviewing your business permit URL.`,
                    "status": "info"
                })

                if (!value.data.user.account.verified) return onOpen();

                return navigate(`/me/${value.data.user._id}`, { replace: true });
            })
            .catch(async (err) => await axios.post(`${baseUrl}/api/user/register`, payload)
                .then(({ data }) => {

                    setUser(data) // assign to global state;

                    setLocalGoogleData({ googleId, profileObj });
                    setLocalUser(data);

                    return onOpen();
                })
                .catch((err) => console.log(err)));

        setLoading(false);
    }

    const onFailure = (res) => {
        console.log(res)
    }


    useEffect(() => {
        gapi.load('client:auth2', () => {
            gapi.auth2.init({ clientId, scope: '' })
        })
    }, []);


    return <React.Fragment>
        <Box position={'relative'}>
            <Box
                height={'100vh'}
                width={'100%'}
                //backgroundImage={backgroundImg}
                style={{
                    backgroundImage: `linear-gradient(31deg, rgba(2,0,36,1) 0%, rgba(21,11,33,1) 0%, rgba(10,19,20,0.49343487394957986) 100%), url(${backgroundImg})`,
                }}>
            </Box>
            <Flex
                style={{
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
                height={'100vh'}
                justify={'center'}
                alignItems={'center'}
                position={'absolute'}
                zIndex={2}>
                <Box background={primary} p={20} width={'500px'} borderRadius={'lg'}>
                    <Heading color={'white'}>Movie Booking</Heading>
                    <Text color={'white'}>You may quickly reserve tickets for current showings by finding the closest theaters in your region.</Text>
                    <Box mt={'12'}>
                        <GoogleLogin
                            clientId={clientId}
                            buttonText={'Sign in with google'}
                            onSuccess={async (v) => await onSuccess(v)}
                            onFailure={onFailure}
                            cookiePolicy={'single_host_origin'}
                            isSignedIn={false} />
                    </Box>
                </Box>
            </Flex>
        </Box>

        <ModalInputUrl isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
        <ModalSpinner isLoading={navigation.state === 'loading' || loading} />
    </React.Fragment >
}

export default CinemaLogin