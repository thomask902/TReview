import React from 'react';
import history from '../Navigation/history';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MovieIcon from '@mui/icons-material/Movie';

const SiteHeader = () => {
  return (
    <>
    <AppBar 
      position="static"
      style={{ background: '#72c6ed'}}
      >
    <Container maxWidth="false">
        <Toolbar disableGutters>
        
        <Button
          key={"Landing"}
          sx={{ color: "black" }}
          onClick={() => history.push('/')}
          >
            <MovieIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            T-Review
        </Button>
        <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }}}>
            <Button
            key={"Search"}
            sx={{ my: 2, color: "black", display: "block" }}
            onClick={() => history.push('/Search')}
            >
            Search
            </Button>
            <Button
            key={"Reviews"}
            sx={{ my: 2, color: "black", display: "block" }}
            onClick={() => history.push('/Reviews')}
            >
            Reviews
            </Button>
            <Button
            key={"TopMovies"}
            sx={{ my: 2, color: "black", display: "block" }}
            onClick={() => history.push('/TopMovies')}
            >
            Top Movies
            </Button>
        </Box>
        </Toolbar>
    </Container>
    </AppBar>
    </>
  )
}

export default SiteHeader;