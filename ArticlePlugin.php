<?php

class ArticlePlugin extends OntoWiki_Plugin
{
    /**
     * Event handler method, which is called on menu creation.
     *
     * @param Erfurt_Event $event
     *
     * @return bool
     */
    public function onCreateMenu($event)
    {
        /*
        $menu   = $event->menu;
        $owApp  = OntoWiki::getInstance();
        $module   = $this->_request->getParam('module');
        $resource = $this->_request->getParam('resource');
                
        $menu->prependEntry(
            'Create article for it',
            (string) $owApp->config->urlBase . 'article/?r='. $resource 
        );
        
        return true;*/
    }
}
