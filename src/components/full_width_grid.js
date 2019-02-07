import Grid from '@material-ui/core/Grid';
import React from 'react';

class FullWidthGrid extends React.Component {
  render(){
    return(
      <div className="FullWidthGridDiv">
        <Grid container spacing={24}>
          <Grid item xs={12}>
          </Grid>
          {this.props.gridCards}
        </Grid>
      </div>
    );
  }
}

export default FullWidthGrid;
