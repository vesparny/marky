import React from 'react'
import { Toolbar, Space, Heading, NavItem } from 'rebass'
import Icon from 'react-geomicons'
import * as colors from '../constants/colors'

const Header = ({wordCount, fileName}) => (
  <div>
    <Toolbar style={{
      backgroundColor: colors.TOMATO
    }}>
      <Heading level={3}>MARKY</Heading>
      <Space auto/>
      <NavItem onClick={() => window.alert('More options will be available soon!')}>
        <Icon
          height='1.5em'
          name='cog'
          width='1.5em'
        />
      </NavItem>
      <Space />
    </Toolbar>
    <Toolbar style={{
      backgroundColor: colors.LIGHT_GRAY,
      height: '40px',
      minHeight: '40px',
      color: colors.TOMATO
    }}>
      <span>{fileName || 'Untitled Document'}</span>
      <Space auto/>
      <span style={{color: colors.VERY_LIGHT_GRAY}}>words:</span>
      <Space/>
      <span>{wordCount}</span>
      <Space/>
    </Toolbar>
  </div>

)

export default Header
