import React, { useMemo, useState } from 'react';
import Page from '../../components/Page';
import { createGlobalStyle } from 'styled-components';
import { useWallet } from 'use-wallet';
import moment from 'moment';
import CountUp from 'react-countup';
import CardIcon from '../../components/CardIcon';
import TokenSymbol from '../../components/TokenSymbol';
import useBombStats from '../../hooks/useBombStats';
import useLpStats from '../../hooks/useLpStats';
import useLpStatsBTC from '../../hooks/useLpStatsBTC';
import useModal from '../../hooks/useModal';
import useZap from '../../hooks/useZap';
import useBondStats from '../../hooks/useBondStats';
import usebShareStats from '../../hooks/usebShareStats';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
import { roundAndFormatNumber } from '../../0x';
import MetamaskFox from '../../assets/img/metamask-fox.svg';
import { Box, Button, Card, CardContent, Grid, Paper, Typography} from '@material-ui/core';
import ZapModal from '../Bank/components/ZapModal';
import { Alert } from '@material-ui/lab';
import { IoCloseOutline } from 'react-icons/io5';
import { BiLoaderAlt } from 'react-icons/bi';
import { makeStyles } from '@material-ui/core/styles';
import useBombFinance from '../../hooks/useBombFinance';
//import { ReactComponent as IconTelegram } from '../../assets/img/telegram.svg';
import { Helmet } from 'react-helmet';
import BombImage from '../../assets/img/bomb.png';
import ProgressCountdown from './components/ProgressCountdown';
import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';
import useCurrentEpoch from '../../hooks/useCurrentEpoch';
//import useBombMaxiStats from '../../hooks/useBombMaxiStats';
import { getDisplayBalance } from '../../utils/formatBalance';
import useTotalStakedOnBoardroom from '../../hooks/useTotalStakedOnBoardroom';
import useFetchBoardroomAPR from '../../hooks/useFetchBoardroomAPR';
import Harvest from './components/Harvest';
import Spacer from '../../components/Spacer';
import Stake from './components/Stake';
import UnlockWallet from '../../components/UnlockWallet';
import styled from 'styled-components';
import useStakedBalanceOnBoardroom from '../../hooks/useStakedBalanceOnBoardroom';
import useWithdrawCheck from '../../hooks/boardroom/useWithdrawCheck';
import useClaimRewardCheck from '../../hooks/boardroom/useClaimRewardCheck';
import useRedeemOnBoardroom from '../../hooks/useRedeemOnBoardroom';

import HomeImage from '../../assets/img/background.jpg';
const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) repeat !important;
    background-size: cover !important;
    background-color: #171923;
  }
`;
const TITLE = 'bomb.money | BTC pegged algocoin';

// const BackgroundImage = createGlobalStyle`
//   body {
//     background-color: grey;
//     background-size: cover !important;
//   }
// `;

const useStyles = makeStyles((theme) => ({
  button: {
    [theme.breakpoints.down('415')]: {
      // marginTop: '10px'
    },
  },
}));

const Dashboard = () => {
  const { account } = useWallet();
  const classes = useStyles();
  const TVL = useTotalValueLocked();
  const bombFtmLpStats = useLpStatsBTC('BOMB-BTCB-LP');
  const bShareFtmLpStats = useLpStats('BSHARE-BNB-LP');
  const bombStats = useBombStats();
  const bShareStats = usebShareStats();
  const tBondStats = useBondStats();
  const bombFinance = useBombFinance();
  const { to } = useTreasuryAllocationTimes();
  const currentEpoch = useCurrentEpoch();
  const totalStaked = useTotalStakedOnBoardroom();
  const boardroomAPR = useFetchBoardroomAPR();
  const stakedBalance = useStakedBalanceOnBoardroom();
  const canWithdraw = useWithdrawCheck();
  const canClaimReward = useClaimRewardCheck();
  const { onRedeem } = useRedeemOnBoardroom();
  
  
 
  const buyBombAddress = //'https://app.1inch.io/#/56/swap/BTCB/BOMB';
    //  'https://pancakeswap.finance/swap?inputCurrency=0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c&outputCurrency=' +
    'https://app.bogged.finance/bsc/swap?tokenIn=0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c&tokenOut=0x522348779DCb2911539e76A1042aA922F9C47Ee3';
  //https://pancakeswap.finance/swap?outputCurrency=0x531780FAcE85306877D7e1F05d713D1B50a37F7A';
  const buyBShareAddress = //'https://app.1inch.io/#/56/swap/BNB/BSHARE';
    'https://app.bogged.finance/bsc/swap?tokenIn=BNB&tokenOut=0x531780FAcE85306877D7e1F05d713D1B50a37F7A';
  const buyBusmAddress =
    'https://app.bogged.finance/bsc/swap?tokenIn=0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56&tokenOut=0x6216B17f696B14701E17BCB24Ec14430261Be94A';
  const bombLPStats = useMemo(() => (bombFtmLpStats ? bombFtmLpStats : null), [bombFtmLpStats]);
  const bshareLPStats = useMemo(() => (bShareFtmLpStats ? bShareFtmLpStats : null), [bShareFtmLpStats]);
  const bombPriceInDollars = useMemo(
    () => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null),
    [bombStats],
  );
  const bombPriceInBNB = useMemo(() => (bombStats ? Number(bombStats.tokenInFtm).toFixed(4) : null), [bombStats]);
  const bombCirculatingSupply = useMemo(() => (bombStats ? String(bombStats.circulatingSupply) : null), [bombStats]);
  const bombTotalSupply = useMemo(() => (bombStats ? String(bombStats.totalSupply) : null), [bombStats]);

  const bSharePriceInDollars = useMemo(
    () => (bShareStats ? Number(bShareStats.priceInDollars).toFixed(2) : null),
    [bShareStats],
  );
  const bSharePriceInBNB = useMemo(
    () => (bShareStats ? Number(bShareStats.tokenInFtm).toFixed(4) : null),
    [bShareStats],
  );
  const bShareCirculatingSupply = useMemo(
    () => (bShareStats ? String(bShareStats.circulatingSupply) : null),
    [bShareStats],
  );
  const bShareTotalSupply = useMemo(() => (bShareStats ? String(bShareStats.totalSupply) : null), [bShareStats]);

  const tBondPriceInDollars = useMemo(
    () => (tBondStats ? Number(tBondStats.priceInDollars).toFixed(2) : null),
    [tBondStats],
  );
  const tBondPriceInBNB = useMemo(() => (tBondStats ? Number(tBondStats.tokenInFtm).toFixed(4) : null), [tBondStats]);
  const tBondCirculatingSupply = useMemo(
    () => (tBondStats ? String(tBondStats.circulatingSupply) : null),
    [tBondStats],
  );
  const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);

  const bombLpZap = useZap({ depositTokenName: 'BOMB-BTCB-LP' });
  const bshareLpZap = useZap({ depositTokenName: 'BSHARE-BNB-LP' });

  const [onPresentBombZap, onDissmissBombZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        bombLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissBombZap();
      }}
      tokenName={'BOMB-BTCB-LP'}
    />,
  );

  const [onPresentBshareZap, onDissmissBshareZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        bshareLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissBshareZap();
      }}
      tokenName={'BSHARE-BNB-LP'}
    />,
  );

  const [modal, setModal] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);

  const openModal = () => {
    setModal(!modal);
  };

  const spinner = () => {
    setVideoLoading(!videoLoading);
  };
    
  
    return (
      <Page>
        <Helmet>
          <title>{TITLE}</title>
        </Helmet>
        <BackgroundImage />
        <Box mt={10}>
          <Typography color="textPrimary" align="center" variant="h4" gutterBottom>
            Bomb Finance Summary
          </Typography>
            <Grid container justify="right" spacing={4}>
            
                  <Grid item xs={12} sm={3}>
                      <Card>
                        <CardContent align="center" style={{ position: 'relative' }}>
                          <Box mt={2}>
                            <CardIcon>
                              <TokenSymbol symbol="BOMB" />
                            </CardIcon>
                          </Box>
                          <Button
                            onClick={() => {
                              bombFinance.watchAssetInMetamask('BOMB');
                            }}
                            style={{ position: 'absolute', top: '10px', right: '10px', border: '1px grey solid' }}
                          >
                            {' '}
                            <b>+</b>&nbsp;&nbsp;
                            <img alt="metamask fox" style={{ width: '20px', filter: 'grayscale(100%)' }} src={MetamaskFox} />
                          </Button>
                          <h2 style={{ marginBottom: '10px' }}>BOMB</h2>
                          10,000 BOMB (1.0 Peg) =
                          <Box>
                            <span style={{ fontSize: '30px', color: 'white' }}>
                              {bombPriceInBNB ? bombPriceInBNB : '-.----'} BTC
                            </span>
                          </Box>
                          <Box>
                            <span style={{ fontSize: '16px', alignContent: 'flex-start' }}>
                              ${bombPriceInDollars ? roundAndFormatNumber(bombPriceInDollars, 2) : '-.--'} / BOMB
                            </span>
                          </Box>
                          <span style={{ fontSize: '12px' }}>
                            Market Cap: ${roundAndFormatNumber(bombCirculatingSupply * bombPriceInDollars, 2)} <br />
                            Circulating Supply: {roundAndFormatNumber(bombCirculatingSupply, 2)} <br />
                            Total Supply: {roundAndFormatNumber(bombTotalSupply, 2)}
                          </span>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* BSHARE */}
                    <Grid item xs={12} sm={3}>
                      <Card>
                        <CardContent align="center" style={{ position: 'relative' }}>
                          <Button
                            onClick={() => {
                              bombFinance.watchAssetInMetamask('BSHARE');
                            }}
                            style={{ position: 'absolute', top: '10px', right: '10px', border: '1px grey solid' }}
                          >
                            {' '}
                            <b>+</b>&nbsp;&nbsp;
                            <img alt="metamask fox" style={{ width: '20px', filter: 'grayscale(100%)' }} src={MetamaskFox} />
                          </Button>
                          <Box mt={2}>
                            <CardIcon>
                              <TokenSymbol symbol="BSHARE" />
                            </CardIcon>
                          </Box>
                          <h2 style={{ marginBottom: '10px' }}>BSHARE</h2>
                          Current Price
                          <Box>
                            <span style={{ fontSize: '30px', color: 'white' }}>
                              {bSharePriceInBNB ? bSharePriceInBNB : '-.----'} BNB
                            </span>
                          </Box>
                          <Box>
                            <span style={{ fontSize: '16px' }}>
                              ${bSharePriceInDollars ? bSharePriceInDollars : '-.--'} / BSHARE
                            </span>
                          </Box>
                          <span style={{ fontSize: '12px' }}>
                            Market Cap: ${roundAndFormatNumber((bShareCirculatingSupply * bSharePriceInDollars).toFixed(2), 2)}{' '}
                            <br />
                            Circulating Supply: {roundAndFormatNumber(bShareCirculatingSupply, 2)} <br />
                            Total Supply: {roundAndFormatNumber(bShareTotalSupply, 2)}
                          </span>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* BBOND */}
                    <Grid item xs={12} sm={3}>
                      <Card>
                        <CardContent align="center" style={{ position: 'relative' }}>
                          <Button
                            onClick={() => {
                              bombFinance.watchAssetInMetamask('BBOND');
                            }}
                            style={{ position: 'absolute', top: '10px', right: '10px', border: '1px grey solid' }}
                          >
                            {' '}
                            <b>+</b>&nbsp;&nbsp;
                            <img alt="metamask fox" style={{ width: '20px', filter: 'grayscale(100%)' }} src={MetamaskFox} />
                          </Button>
                          <Box mt={2}>
                            <CardIcon>
                              <TokenSymbol symbol="BBOND" />
                            </CardIcon>
                          </Box>
                          <h2 style={{ marginBottom: '10px' }}>BBOND</h2>
                          10,000 BBOND
                          <Box>
                            <span style={{ fontSize: '30px', color: 'white' }}>
                              {tBondPriceInBNB ? tBondPriceInBNB : '-.----'} BTC
                            </span>
                          </Box>
                          <Box>
                            <span style={{ fontSize: '16px' }}>${tBondPriceInDollars ? tBondPriceInDollars : '-.--'} / BBOND</span>
                          </Box>
                          <span style={{ fontSize: '12px' }}>
                            Market Cap: ${roundAndFormatNumber((tBondCirculatingSupply * tBondPriceInDollars).toFixed(2), 2)} <br />
                            Circulating Supply: {roundAndFormatNumber(tBondCirculatingSupply, 2)} <br />
                            Total Supply: {roundAndFormatNumber(tBondTotalSupply, 2)}
                          </span>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} md={5} lg={2} sm={2} className={classes.gridItem}>
                      <Card className={classes.gridItem}>
                        <CardContent style={{ textAlign: 'center' }}>
                          <Typography style={{ textTransform: 'uppercase', color: '#FFFFFF' }}>Current Epoch</Typography>
                          <Typography>{Number(currentEpoch)}</Typography>
                          <Typography style={{ textTransform: 'uppercase', color: '#FFFFFF' }}>Next Epoch</Typography>
                          <ProgressCountdown  base={moment().toDate()} hideBar={true} deadline={to} description="Next Epoch" />
                          <Typography style={{ textTransform: 'uppercase', color: '#FFFFFF' }}>TVL</Typography>
                          <CountUp style={{ fontSize: '25px', color: '#00E8A2' }} end={TVL} separator="," prefix="$" />
                        </CardContent>
                      </Card>
                    </Grid>

                
            </Grid>
        </Box>

        <Box mt={10}>
        
        <Grid item xs={12}  sm={11} className={classes.gridItem}>
          <Card className={classes.gridItem}>
            <CardContent style={{ textAlign: 'center' }}>
              <Typography color="textPrimary" align="center" variant="h4" gutterBottom>
                Boardroom
              </Typography>
              <Typography style={{ textTransform: 'uppercase', color: '#00E8A2' }}>Total Staked</Typography>
              <Typography>{getDisplayBalance(totalStaked)}</Typography>
              <Typography style={{ textTransform: 'uppercase', color: '#00E8A2' }}>Daily Returns:</Typography>
              <Typography>{boardroomAPR.toFixed(2)/365}%</Typography>

              {!!account ? (
                  <Box mt={4}>
                    <StyledBoardroom>
                      <StyledCardsWrapper>
                        <StyledCardWrapper>
                          <Harvest />
                        </StyledCardWrapper>
                        <Spacer />
                        <StyledCardWrapper>
                          <Stake />
                        </StyledCardWrapper>
                      </StyledCardsWrapper>
                    </StyledBoardroom>
                  </Box>
              ) : (
                  <UnlockWallet />
              )}

              {!!account && (
                <Box mt={5}>
                  <Grid container justify="center" spacing={3} mt={10}>
                    <Button
                      disabled={stakedBalance.eq(0) || (!canWithdraw && !canClaimReward)}
                      onClick={onRedeem}
                      className={
                        stakedBalance.eq(0) || (!canWithdraw && !canClaimReward)
                          ? 'shinyButtonDisabledSecondary'
                          : 'shinyButtonSecondary'
                      }
                    >
                      Claim &amp; Withdraw
                    </Button>
                  </Grid>
                </Box>
              )}

            </CardContent>
          </Card>
        </Grid>
        </Box>
        
        
      </Page>
    );
    
  };

  const StyledBoardroom = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledCardsWrapper = styled.div`
  display: flex;
  width: 600px;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
`;
  
  export default Dashboard;
