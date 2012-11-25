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
        $controller = $request->getControllerName();
        $action = $request->getActionName();

        if(($controller == 'resource' && $action == 'properties')){
            OntoWiki::getInstance ()->getNavigation()->register('article', array(
                'controller' => 'article',     
                'action'     => 'edit',        
                'name'       => 'Article',
                'priority'   => 20
            ));
        }

        if($controller == 'article' && $action == 'edit'){
            OntoWiki::getInstance ()->getNavigation()->register('article', array(
                'controller' => 'article',     
                'action'     => 'edit',        
                'name'       => 'Article',
                'priority'   => 1
            ));
        }
    }
}
