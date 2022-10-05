import React from 'react';
import Typography from "@material-ui/core/Typography";
import Box from "@mui/material/Box";
import Button from '@material-ui/core/Button';
import SiteHeader from '../SiteHeader';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import { MuiThemeProvider } from '@material-ui/core';
import theme from '../Theme';

//Dev mode
//const serverURL = ""; //enable for dev mode

//Deployment mode instructions
const serverURL = "http://ec2-18-216-101-119.us-east-2.compute.amazonaws.com:3039"; //enable for deployed mode; Change PORT to the port number given to you;
//To find your port number: 
//ssh to ov-research-4.uwaterloo.ca and run the following command: 
//env | grep "PORT"
//copy the number only and paste it in the serverURL in place of PORT, e.g.: const serverURL = "http://ov-research-4.uwaterloo.ca:3000";

const fetch = require("node-fetch");

const TopMovies = () => {

  const [topMovies, setTopMovies] = React.useState([]);

  const[chosenGenre, setChosenGenre] = React.useState("");

  const [genres, setGenres] = React.useState([]);

  const callApiGetTopMovies = async () => {
    const url = serverURL + "/api/getTopMovies";

    // waiting on response from api call of type POST which will be in the form of a json object
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chosenGenre: chosenGenre
      })
    });

    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    console.log("Top Movies: ", body);
    return body;
  }

  const getTopMovies = () => {
    callApiGetTopMovies()
      .then(res => {

        //printing to console what was returned
        console.log("getTopMovies API Returned: " + res);
        var parsedTopMovies = JSON.parse(res.express);
        console.log("Top Movie List Parsed: ", parsedTopMovies);

        // sets stateful variable movies to the value of the list parsedMovies
        setTopMovies(parsedTopMovies);
      });
  }

  const callApiGetGenres = async () => {
    const url = serverURL + "/api/getGenres";

    // waiting on response from api call of type POST which will be in the form of a json object
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    console.log("Genres: ", body);
    return body;
  }

  const getGenres = () => {
    callApiGetGenres()
      .then(res => {

        //printing to console what was returned
        console.log("getGenres API Returned: " + res);
        var parsedGenres = JSON.parse(res.express);
        console.log("Genres List Parsed: ", parsedGenres);

        // sets stateful variable movies to the value of the list parsedMovies
        setGenres(parsedGenres);
      });
  }

  React.useEffect(() => {
    getGenres();
  }, []);

  const handleChosenGenre = (event) => {
    setChosenGenre(event.target.value);
  }

  const onClick = () => {
    getTopMovies();
  }

  return (
    <MuiThemeProvider theme={theme}>
    <Grid
      container
      spacing={0}
      direction="column"
    >
      <SiteHeader/>
      <Box sx={{p: 2}}>
        <Typography 
        variant="h5" 
        color="inherit" 
        noWrap
        >
          Choose a genre to see its top rated movies:
        </Typography>
      </Box>
      <Box sx={{p: 2}}>
      <Typography variant="h7">
          This page will return the top 5 highest rated movies for the genre of your choice (genres drama, action, and adventure have enough reviews to give a good example).
      </Typography>
      </Box>
      <FormControl>
      <Box sx={{p: 2}}>
        <FormLabel id="rating-radio-buttons-group-label">Click one of the buttons below and hit search!</FormLabel>
      </Box>
      <Box sx={{p: 2}}>
      <RadioGroup
          aria-labelledby="rating-radio-buttons-group-label"
          name="rating-radio-buttons-group"
          value={chosenGenre}
          onChange={handleChosenGenre}
          row
        >
          {genres.map((item, key) => {
              return (
                <FormControlLabel
                  value={item.genre}
                  control={<Radio />} 
                  label={item.genre}
                />
              )
            })
            }
        </RadioGroup>
      </Box>
      </FormControl>
    <Box sx={{p: 2}}>
      <Button
        variant="outlined"
        onClick={onClick}
      >
        Search
      </Button>
    </Box>
      <List>
        {topMovies.map((item, key) => {
              return (
                <>
                
                <ListItem>
                  <ListItemText
                    primary={item.name}
                    secondary= {"Year: " + item.year + ", Average Rating: " + item.avg}
                  />
                </ListItem>
                <Divider />
                </>
              )
            })
            }
      </List>
    </Grid>
    </MuiThemeProvider>
  );
}

export default TopMovies;
