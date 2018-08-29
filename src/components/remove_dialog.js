import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';
import TextField from '@material-ui/core/TextField';

export default class RemoveDialog extends React.Component {
  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleQuitar = () => {
    if (this.state.value >= 0) {
      this.props.cart(this.props.sensor, this.state.value)
      this.setState({ open: false });
    }
  };

  setValue(event) {
    this.setState({ value: event.target.value })
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
          Quitar del carrito
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Quitar del carrito
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Cuantos elementos quieres quitar del carrito.
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
            <Button onClick={this.handleQuitar} color="primary">
              Quitar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
