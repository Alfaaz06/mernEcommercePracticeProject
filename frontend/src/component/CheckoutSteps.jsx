import { Step, StepLabel, Stepper, Typography } from '@material-ui/core';
import { AccountBalance, LibraryAddCheck, LocalShipping } from '@material-ui/icons';
import React from 'react';
import './CheckoutSteps.css'

export const CheckoutSteps = ({ activeStep }) => {

    const steps = [
        {
            label: <Typography>Shipping Details</Typography>,
            icon: <LocalShipping />,
        },
        {
            label: <Typography>Confirm Order</Typography>,
            icon: <LibraryAddCheck />,
        },
        {
            label: <Typography>Payment</Typography>,
            icon: <AccountBalance />,
        }
    ]

    return <>
        <Stepper alternativeLabel activeStep={activeStep} style={{boxSizing:"border-box"}}>
            {steps.map((item, index) => (
                <Step key={index} active={activeStep===index?true:false} completed={activeStep>=index?true:false}>
                    <StepLabel style={{color:activeStep>=index?"tomato":"rgba(0,0,0,0.649)"}} icon={item.icon}>{item.label}</StepLabel>
                </Step>
            ))}
        </Stepper>
    </>;
};
