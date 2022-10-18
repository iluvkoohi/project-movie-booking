import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { HashLoader, PropagateLoader } from "react-spinners";
import { primary } from "../const/colors";

export const ModalSpinner = ({ isLoading }) => {
    return <Modal isOpen={isLoading} isCentered>
        <ModalOverlay background={'whiteAlpha.800'} />
        <ModalContent
            background={"transparent"}
            boxShadow={"none"}
            alignContent={"center"}
            alignItems={"center"}
            justifyContent={"center"}>
            <PropagateLoader color={primary} />
        </ModalContent>
    </Modal>;
}