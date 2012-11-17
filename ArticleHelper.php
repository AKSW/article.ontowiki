<?php

class ArticleHelper extends OntoWiki_Component_Helper
{
    /**
     * 
     */
    public function init()
    {
        // get current request info
        $request  = Zend_Controller_Front::getInstance()->getRequest();

        if(($request->getControllerName() == 'resource' && $request->getActionName() == 'properties')){
            OntoWiki::getInstance ()->getNavigation()->register('article', array(
                'controller' => 'article',     
                'action'     => 'edit',        
                'name'       => 'Article',
                'priority'   => 20
            ));
        }

        if($request->getControllerName() == 'article'){
            OntoWiki::getInstance ()->getNavigation()->register('article', array(
                'controller' => 'article',     
                'action'     => 'edit',        
                'name'       => 'Article',
                'priority'   => 1
            ));
        }
    }
}
