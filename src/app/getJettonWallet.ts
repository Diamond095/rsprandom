import React, { useState } from 'react';

export const getJettonWallet = async (userAddress) => {
    try {
    const response = await fetch('https://mosaicsys.xyz:3001/getJettonWallet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userAddress })
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
  
};
