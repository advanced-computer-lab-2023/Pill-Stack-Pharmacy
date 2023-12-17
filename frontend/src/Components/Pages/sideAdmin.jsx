import React from 'react';
import '../UI/Sidebar.css'; 
import { accordionTheme } from '../UI/theme.js';
import { HamburgerIcon,SettingsIcon,ArrowRightIcon } from "@chakra-ui/icons";
import { extendTheme } from '@chakra-ui/react'; // Add this import
import pillstackLogo from '../UI/Images/pillstackLogo.png';
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Box,
  Text,
  AccordionIcon,
} from '@chakra-ui/react';

function SidebarAdmin(props) {
  const {
    openSecondModal,
    openAddFamilyModal,
    openViewFamilyModal,
    openUploadDocModal,
    navigate,
    username,
    name,
    onOpenModal,
    onLogout,
    openAddDeliveryModal,
  } = props;

  const sidebarStyle = {
    width: '15%',
    paddingTop: '7px',
    borderTopRightRadius: '0px', 
    borderBottomRightRadius: '0px', 
  };

  const customAccordionTheme = extendTheme({
    components: {
      Accordion: accordionTheme,
    },
  });

  return (
    <div className="sidebar" style={sidebarStyle}>
      <Link to="/admin-home">
      <Box textAlign="center" p={5} mb={1} mr={1}>
        <img src={pillstackLogo} alt="Logo" width="220" />
      </Box>
    </Link>

     <br />
      <Accordion defaultIndex={[0]} allowToggle={true} allowMultiple={false} theme={customAccordionTheme}>
        <AccordionItem  >
          <h2>
            <AccordionButton>
              <HamburgerIcon w={7} h={7} mr={3}></HamburgerIcon>
              <Box as="span" flex='1' textAlign='left'>
                Manage
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel p={0}>
          <Link to="/admin-users" style={{ textDecoration: 'none', color: 'inherit' }}> 
            <AccordionButton>
              <Box as="span" flex='1' textAlign='left' ml={10}>
              
                Users
                
              </Box>
            </AccordionButton>
            </Link>
            <Link to="/admin-requests" style={{ textDecoration: 'none', color: 'inherit' }}> 
            <AccordionButton>
              <Box as="span" flex='1' textAlign='left' ml={10}>
              
                Pharmacist Requests
                
              </Box>
            </AccordionButton>
            </Link>
           
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            
            <AccordionButton>
              <HamburgerIcon w={7} h={7} mr={3}></HamburgerIcon>
              <Box as="span" flex='1' textAlign='left'>
                Sales
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>

          <AccordionPanel p={0}>
          <Link to={"/salesReport"} style={{ textDecoration: 'none', color: 'inherit' }}>
            <AccordionButton>
              <Box as="span" flex='1' textAlign='left' ml={10}>
                Sales Report
              </Box>
            </AccordionButton>
            </Link>
           
          </AccordionPanel>
        </AccordionItem>

 
<AccordionItem style={{ position: 'fixed', bottom: 10, marginTop: 'auto' }}>
  <AccordionButton
    onClick={onLogout}
    _hover={{
      textDecoration: 'underline',
    }}
  >
    <ArrowRightIcon w={4} h={4} mr={4}></ArrowRightIcon>
    <Box  flex="1" textAlign="left">
      Log Out
    </Box>
  </AccordionButton>
</AccordionItem>

      </Accordion>
    </div>
  );
}

export default SidebarAdmin;
