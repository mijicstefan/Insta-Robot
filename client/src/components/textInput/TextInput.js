import React, { Fragment, useState, useRef } from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import svgAnimation from "../../img/svgAnimations/instagramAnimation.svg";
import { Typography } from "@material-ui/core";
import axios from "axios";
import CheckCircleOutlineRoundedIcon from '@material-ui/icons/CheckCircleOutlineRounded';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

export default function FormPropsTextFields() {
  const classes = useStyles();

  const buttonReference = useRef(null);

  const [instagramUsername, setInstagramUsername] = useState({
    username: "",
  });

  const [approveMessage, setApproveMessage] = useState({
    message: "",
  });
  let buttonDisabled = false;

  const onChange = (e) => {
    e.preventDefault();
    // setDetails({ ...details, [e.target.name]: e.target.value });
    setInstagramUsername({
      ...instagramUsername,
      [e.target.name]: e.target.value,
    });
    console.log(instagramUsername);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    buttonReference.current.disabled = true;
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/instagram/loginAndCheckFollowing",
        { username: instagramUsername.username },
        {
          headers: {
            // 'application/json' is the modern content-type for JSON, but some
            // older servers may use 'text/json'.
            // See: http://bit.ly/text-json
            "content-type": "application/json",
          },
        }
      );
      console.log(res.data.approveMessage);
      setApproveMessage({
        ...approveMessage,
        message: res.data.approveMessage,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <Grid alignItems="flex-end" justify="center" container spacing={3}>
        <img
          style={{ width: "300px", height: "350px" }}
          src={svgAnimation}
          alt="Instagram SVG"
        />
      </Grid>
      <Grid alignItems="flex-end" justify="center" container spacing={3}>
        <Grid item xs={4}>
          <Paper elevation={3}>
            <Fragment>
              <div>
                <TextField
                  id="standard-required"
                  label="@username"
                  name="username"
                  onChange={(e) => onChange(e)}
                />
              </div>
              <div>
                <Button ref={buttonReference} 
                  onClick={(e) => onSubmit(e)}
                  variant="contained"
                  color="primary"
                >
                  Search and approve
                </Button>
              </div>
              <div>
                <Typography
                  color="textSecondary"
                  component="aside"
                  variant="body1"
                >
                  If you are on the pending following list, your request will be
                  accepted. It might take a few seconds.
                </Typography>
                {approveMessage.message ===
                "Your follow request has been accepted." ? (
                  <Typography
                    style={{ color: "green" }}
                    component="animateTransform"
                    variant="caption"
                  >
                    <CheckCircleOutlineRoundedIcon/> {approveMessage.message}
                  </Typography>
                ) : (
                  <Typography color="error" component="aside" variant="body1">
                    {approveMessage.message}
                  </Typography>
                )}
              </div>
            </Fragment>
          </Paper>
        </Grid>
      </Grid>
    </form>
  );
}
