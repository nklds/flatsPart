import React, {useEffect, useState} from 'react';
import styles from './Filters.module.scss';
import clsx from 'clsx';
import Typography from "@mui/material/Typography";

import RoomButton from "@/components/Pages/FilterApartmentPage/RoomButton";
import {FormButton} from "@/components/CommonComponents/Form/Form";
import FinalSlider from "@/components/Pages/FilterApartmentPage/TooltipSlider";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";



const Filters = ({
                     allFlats, rooms,
                     roomsTotalMax, priceTotalMin, priceTotalMax, squareTotalMin, squareTotalMax, floorsTotal,

                     queryState, setQueryState,

                     ...props
                 }) => {

    return (
        <Box className={clsx(styles.filters)} {...props}>
            <Grid container spacing={3}>
                <Grid item component={`section`} xs={12} sm={6} lg={12}>
                    <Typography component='h2' variant='textS' color={'black'} style={{marginBottom: '8px'}}>
                        Количество комнат
                    </Typography>
                    <Grid container component={`ul`} spacing={3}>
                        {rooms.map((room, idx) => {
                            return (
                                <Grid component={`li`} item key={`button-${idx}`} xs={3}>
                                    <RoomButton
                                        text={room !== 0 ? room : 'СТ'}
                                        value={room}
                                        isActive={queryState.selectedRooms.includes(room)}
                                        selectedRooms={queryState.selectedRooms}
                                        setQueryState={setQueryState}
                                        queryState={queryState}
                                    />
                                </Grid>
                            );
                        })
                        }
                    </Grid>
                </Grid>
                <Grid item component={`section`} xs={12} sm={6} lg={12} className={styles.filter}>
                    <Typography style={{marginBottom: '8px'}} component='h2'>
                        Стоимость (млн. руб.)
                    </Typography>
                    <FinalSlider
                        onChange={(newPrice)=>{
                            let newQueryState = {...queryState};
                            newQueryState.selectedPriceMin = newPrice[0];
                            newQueryState.selectedPriceMax = newPrice[1];
                            setQueryState(newQueryState);
                        }}
                        range
                        min={3.5}
                        max={14}
                        step={0.5}
                        defaultValue={[3.5, 14]}
                        tipFormatter={(value) => `${value} млн`}
                    />
                </Grid>
                <Grid item component={`section`} xs={12} sm={6} lg={12} className={styles.filter}>
                    <Typography style={{marginBottom: '8px'}} component='h2' >
                        Площадь м<sup>2</sup>
                    </Typography>
                    <FinalSlider
                        onChange={(newSquare)=>{
                            let newQueryState = {...queryState};
                            newQueryState.selectedSquareMin = newSquare[0];
                            newQueryState.selectedSquareMax = newSquare[1];
                            setQueryState(newQueryState);
                        }}
                        range
                        min={22}
                        max={64}
                        step={1}
                        defaultValue={[22, 64]}
                        tipFormatter={(value) => `${value} м2`}
                    />
                </Grid>
                <Grid item component={`section`} xs={12} sm={6} lg={12} className={styles.filter}>
                    <Typography style={{marginBottom: '8px'}} component='h2' >
                        Этаж <sup> </sup>
                    </Typography>
                    <FinalSlider
                        onChange={(newFloor)=>{
                            let newQueryState = {...queryState};
                            newQueryState.selectedFloorMin = newFloor[0];
                            newQueryState.selectedFloorMax = newFloor[1];
                            setQueryState(newQueryState);
                        }}
                        range
                        min={1}
                        max={22}
                        step={1}
                        defaultValue={[1, 22]}
                        tipFormatter={(value) => `${value} этаж`}
                    />
                </Grid>

                <Grid item xs={12} sm={6} lg={12} className={styles.filter}>
                    <FormButton onClick={()=>newQueryState({})} submitButtonText={"Сбросить фильтр"} formError={false}/>
                </Grid>

            </Grid>

        </Box>
    )
}

export default Filters;

export async function getStaticProps(context) {
    const allFlats = await fetch("http://localhost:3000/api/flats/100");


    return {
        props: {
            roomsTotalMax: 3,
            priceTotalMin: 3500000,
            priceTotalMax: 14000000,
            squareTotalMin: 22,
            squareTotalMax: 64,
            floorsTotal: 22,
        }
    }
}
