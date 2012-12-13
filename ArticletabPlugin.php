<?php
/**
 * This file is part of the {@link http://ontowiki.net OntoWiki} project.
 *
 * @copyright Copyright (c) 2012, {@link http://aksw.org AKSW}
 * @license http://opensource.org/licenses/gpl-license.php GNU General Public License (GPL)
 */

/**
 * @category   OntoWiki
 * @package    extensions_article
 */
class ArticletabPlugin extends OntoWiki_Plugin
{
    public function onRouteStartup($event){
        $viewOnClass = $this->_privateConfig->get('viewOnClass');
        $foundViewOnClass = false;

        if (isset($_REQUEST['r']))
        {
            $currentResource = $_REQUEST['r'];
            $currentResourceClasses = OntoWiki::getInstance()->selectedModel->sparqlQuery(
                'SELECT ?uri
                WHERE {
                    <' . $currentResource . '> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?uri.
                };'
            );

            foreach ($currentResourceClasses as $currentResourceClass)
            {
                if ($currentResourceClass['uri'] == $viewOnClass)
                {
                    $foundViewOnClass = true;
                    break;
                }
            }

            if (true == $foundViewOnClass)
            {
                // get current route info
                $front  = Zend_Controller_Front::getInstance();
                $router = $front->getRouter();

                // we must set a new route so that the navigation class knows,
                $route = new Zend_Controller_Router_Route(
                    'resource/properties',                       // hijack 'resource/properties' shortcut
                    array(
                        'controller' => 'article', // map to 'semanticsitemap' controller and
                        'action'     => 'edit'    // 'sitemap' action
                    )
                );
                $route->setMatchedPath('resource/properties');
                // add the new route
                $router->addRoute('article', $route);
            }
        }
    }
}
