import * as React from 'react';

import { makeStyles } from '@material-ui/core';

import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    root: {
        position: 'relative',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        background: 'gainsboro',
    },
});

interface ICardProps {
    children?: React.ReactNode;
}

export const Card = ({
    children = null,
}: ICardProps) => {
    const classes = useStyles();
    return (
        <Paper className={classes.root}>
            {children}
        </Paper>
    );
};

export default Card;

