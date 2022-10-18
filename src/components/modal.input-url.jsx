import React, { useEffect, useRef, useState } from "react"
import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useToast } from "@chakra-ui/react";
import { useLocalStorage } from "../hooks/useLocalstorage.hook";
import axios from "axios";
import { baseUrl } from "../const/api";
import { useRecoilValue } from "recoil";
import { userState } from "../state/profile";

export const ModalInputUrl = ({ isOpen, onOpen, onClose }) => {

    // React Custom Hooks
    const [localGoogleData, setLocalGoogleData] = useLocalStorage('movie-booking:google');
    const [localUser, setLocalUser] = useLocalStorage('movie-booking:user');

    // React Hooks
    const user = useRecoilValue(userState);
    const inputPermitRef = useRef(null)
    const [loading, setLoading] = useState(false);

    // Others
    const toast = useToast();

    // Methods 
    const validateUrl = (value) => {
        return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
    }

    const onSubmit = async () => {
        try {
            const permitUrl = inputPermitRef.current.value.trim();
            if (permitUrl === "") return toast({
                "title": "VALIDATION FAILED",
                "description": "The business permit URL is required",
                "status": "error"
            })
            if (!validateUrl(permitUrl)) return toast({
                "title": "VALIDATION FAILED",
                "description": "The business permit URL is invalid",
                "status": "error"
            })

            setLoading(true);
            const response = await axios.put(`${baseUrl}/api/user/permit`, {
                "_id": user.user._id,
                permitUrl
            });
            console.log(response.data)
            setLoading(false);
            return toast({
                "title": "SUCCESSFUL",
                "description": "The business permit URL will be checked immediately.",
                "status": "success",
                duration: 2000,
                onCloseComplete: () => onClose()
            })
        } catch (error) {
            console.log(error)
            setLoading(false)
            return toast({
                "title": "FAILED",
                "description": "Something went wrong while uploading your URL, Please try again later.",
                "status": "error",
                duration: 2000,
                onCloseComplete: () => onClose()
            })
        }
    }


    return <React.Fragment>
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size={'2xl'}
            isCentered>
            <ModalOverlay />
            <ModalContent p={'10'}>
                <ModalHeader>VERIFICATION</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </Text>
                    <FormControl mt={'10'} isRequired>
                        <FormLabel>Business permit URL</FormLabel>
                        <Input
                            type={'text'}
                            ref={inputPermitRef}
                            placeholder='https://cloud.com/my-business-permit.jpeg' />
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button
                        colorScheme='blue'
                        mr={3}
                        isLoading={loading}
                        onClick={() => onSubmit()}>
                        Submit
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </React.Fragment>
}