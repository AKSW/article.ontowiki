<?php
/**
 * This file is part of the {@link http://ontowiki.net OntoWiki} project.
 *
 * @copyright Copyright (c) 2013, {@link http://aksw.org AKSW}
 * @license http://opensource.org/licenses/gpl-license.php GNU General Public License (GPL)
 */

class ArticleHelper extends OntoWiki_Component_Helper
{
    /**
     *
     */
    public function init()
    {
        if ('properties' == OntoWiki::getInstance()->lastRoute) {
            // Show tab only if model is selected and editable
            $modelIsSelected = null != OntoWiki::getInstance()->selectedModel;

            if (true == $modelIsSelected) {

                $modelIsEditable = OntoWiki::getInstance()->selectedModel->isEditable();

                if ( true == $modelIsEditable ) {
                    //Ontowiki Navigation
                    $navigation = OntoWiki::getInstance()->getNavigation();

                    // get current request info

                    $request  = Zend_Controller_Front::getInstance()->getRequest();
                    $controller = $request->getControllerName();
                    $action = $request->getActionName();

                    // set standard priority
                    $standardPriority = $this->_privateConfig->get('standardPriority');

                    $navigation->register(
                        'article',
                        array(
                            'controller' => 'article',
                            'action'     => 'edit',
                            'name'       => 'Article',
                            'priority'   => $standardPriority
                        )
                    );
                }
            }
        }
    }

    public function onRouteStartup($event)
    {
        $viewOnClass = $this->_privateConfig->get('viewOnClass');
        $foundViewOnClass = false;

        $request = Zend_Controller_Front::getInstance()->getRequest();

        if ("" != $request->getParam('r')) {
            $currentResource = $request->getParam('r');
            if ("" != $currentResource && isset(OntoWiki::getInstance()->selectedModel)) {
                $currentResourceClasses = OntoWiki::getInstance()->selectedModel->sparqlQuery(
                    'SELECT ?uri
                    WHERE {
                        <' . $currentResource . '>
                            <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?uri.
                    };'
                );

                foreach ($currentResourceClasses as $currentResourceClass) {
                    if ($currentResourceClass['uri'] == $viewOnClass) {
                        $foundViewOnClass = true;
                        break;
                    }
                }

                if (true == $foundViewOnClass) {
                    // get current route info
                    $front  = Zend_Controller_Front::getInstance();
                    $router = $front->getRouter();

                    // we must set a new route so that the navigation class knows,
                    $route = new Zend_Controller_Router_Route(
                        'resource/properties',         // hijack 'resource/properties' shortcut
                        array(
                            'controller' => 'article', // map to 'semanticsitemap' controller and
                            'action'     => 'edit'     // 'sitemap' action
                        )
                    );
                    $route->setMatchedPath('resource/properties');
                    // add the new route
                    $router->addRoute('article', $route);
                }
            }
        }
    }
}
