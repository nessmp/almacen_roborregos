import Grid from '@material-ui/core/Grid';
// import PropTypes from 'prop-types';
import React from 'react';
// import TextField from '@material-ui/core/TextField';
import './styles.css'

class FullWidthGrid extends React.Component {
  render(){
    return(
      <div className="FullWidthGridDiv">
        <Grid container spacing={24}>
          <Grid item xs={12}>
            {
              // TODO: Implement searchbox
              // <TextField
              // InputLabelProps={{
              //   shrink: true,
              // }}
              // placeholder="Search..."
              // fullWidth
              // margin="normal"
              // />
            }
          </Grid>
          {this.props.gridCards}
        </Grid>
      </div>
    );
  }
}

export default FullWidthGrid;
