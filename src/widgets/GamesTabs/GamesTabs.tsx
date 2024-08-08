// GamesTabs.tsx
import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { GameList } from '@/shared/ui/GameList';

import './GamesTabs.scss';

const GamesTabs: React.FC = () => {
    return (
        <Tabs className="games-tabs">
            <TabList className="games-tabs__tab-list">
                <Tab className="games-tabs__tab" selectedClassName="games-tabs__tab--selected">
                    <span className="material-symbols-outlined">language</span>
                    <span>Новые игры</span>
                </Tab>
                <Tab className="games-tabs__tab" selectedClassName="games-tabs__tab--selected">
                    <span className="material-symbols-outlined">history</span>
                    <span>История</span>
                </Tab>
            </TabList>

            <TabPanel className="games-tabs__tab-panel" selectedClassName="games-tabs__tab-panel--active">
                <GameList type="active" />
            </TabPanel>

            <TabPanel className="games-tabs__tab-panel" selectedClassName="games-tabs__tab-panel--active">
                <GameList type="inactive" />
            </TabPanel>
        </Tabs>
    );
};

export default GamesTabs;
