<?php 

class Article_Article {
    
    protected $_m;
    protected $_predicate;
    protected $_r;
    
    /**
     * 
     */
    function __construct ( Erfurt_Rdf_Resource $r, Erfurt_Rdf_Model $m, $predicate ) {
        $this->_r = $r;
        $this->_m = $m;
        $this->_predicate = $predicate;
        $this->_resourceInstance = new Article_Resource ( $this->_m );
    }
    
    /**
     * 
     */
    public function create ( $content ) {
        $this->_resourceInstance->add ( 
            $this->_r, $this->_predicate, $content
        );
        
        return $this;
    }
    
    /**
     * Check if an article for the given resource exists.
     * @return bool true if exists, otherwise false
     */
    public function exists () {
        
        $res = $this->_m->sparqlQuery (
            "SELECT ?s ?p ?o 
              WHERE {
                  ?s ?p ?o.
                  ?s <". $this->_predicate ."> ?o.
                  <". $this->_r ."> <". $this->_predicate ."> ?o.
             }
             LIMIT 1;" 
        );
        
        return 1 > count ( $res ) ? false : true;
    }
    
    /**
     * Get associated article for given resource
     */
    public function get () {
        $res = $this->_m->sparqlQuery (
            "SELECT ?s ?p ?o 
              WHERE {
                  ?s ?p ?o.
                  ?s <". $this->_predicate ."> ?o.
                  <". $this->_r ."> <". $this->_predicate ."> ?o.
             }
             LIMIT 1;" 
        );
        
        return 1 > count ( $res ) ? false : $res [0];
    }
    
    /**
     * 
     */
    public function remove () {
        
        $result = $this->get ();
        $s = $result ['s']; $p = $result ['p']; 
        $o = array ( 'type' => Erfurt_Store::TYPE_LITERAL, 'value' => $result ['o'] );
        
        $this->_m->deleteMatchingStatements ( $s, $p, $o );
        
        return $this;
    }
}
