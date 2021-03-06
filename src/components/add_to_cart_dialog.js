import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';
import TextField from '@material-ui/core/TextField';

var firebase = require('firebase/app');
require('firebase/auth');
require('firebase/database');

export default class AddToCartDialog extends React.Component {
  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleAgregar = async () => {
    var ref = firebase.database().ref(this.props.tab + "/" + this.props.sensor);
    var numDisp;
    // Read database to know how  many sensors are available for the requested
    // sensor
    await ref.once('value').then((snapshot) => {
      numDisp = snapshot.val()
    });
    if(this.state.value <= numDisp && this.state.value > 0) {
      this.props.cart(this.props.sensor, this.state.value, this.props.tab)
      this.setState({ open: false });
    }
  };

  setValue(event) {
    this.setState({ value: Math.floor(event.target.value) })
  }

  constructor(props){
    super(props);

    this.state = {
      value: 0,
      open: false
    };

    this.setValue = this.setValue.bind(this);
  }

  render() {
    return (
      <div>
        <Button size="small" color="primary" onClick={this.handleClickOpen}>
          Agregar al carrito
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Agregar al carrito
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Cuantos elementos quieres agregar al carrito.
              Max: {this.props.disp}
            </DialogContentText>
            <TextField
              onChange={this.setValue}
              autoFocus
              margin="dense"
              label="Cantidad"
              type="number"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancelar
            </Button>
            <Button onClick={this.handleAgregar} color="primary">
              Agregar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
