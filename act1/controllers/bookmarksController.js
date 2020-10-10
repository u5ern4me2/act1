const Repository = require('../models/Repository');

module.exports =
class BookmarksController extends require('./Controller') {
    constructor(req, res) {
        super(req, res);
        this.bookmarksRepository = new Repository('Bookmarks');
    }
    //GET: api/bookmarks
    //getL api/bookmarks/{id}
    get(id) {
        if(!isNaN(id))
            this.response.JSON(this.bookmarksRepository.get(id));
        else
            this.response.JSON(this.bookmarksRepository.getAll());
    }
    //POST
    post(bookmark) {
        let newBookmark = this.bookmarksRepository.add(bookmark);
        if(newBookmark){
            this.response.created(newBookmark);
        }
        else {
            this.response.internalError();
        }
    }
    //PUT
    put(bookmark){
        if(this.bookmarksRepository.update(bookmark)){
            this.response.ok();
        }
        else
        {
            this.response.notFound();
        }
    }
    //delete
    remove(id){
        if(this.bookmarksRepository.remove(id)){
            this.response.accepted();
        }
        else {
            this.response.notFound();
        }
    }
    get(){
        let params = this.getQueryStringParams();
        if(params !== null) {
            if(Object.keys(params).length === 0) {
                this.queryStringHelp();
            }
            else
            {
                this.checkParams(params);
            }
            
        }
    }
    checkParams(params){
        if(params.sort){
            if(params.sort == "name"){
                this.response.JSON(this.bookmarksRepository.SortByFieldName("Name"));
            }
            else if(params.sort == "category"){
                this.response.JSON(this.bookmarksRepository.SortByFieldName("Category"));
            }
        }
        else if(params.name){
            if(params.name.includes("*")) {

            }
            else
            {
                this.response.JSON(this.bookmarksRepository.findByField("Name",params.name));
            }
        }
        else if(params.category) {
            this.response.JSON(this.bookmarksRepository.findByField("Category",params.category));
        }
        else {
            return this.error(params, "param invalide");
        }
    }
    queryStringHelp() {
        
        this.res.writeHead(200, {'content-type':'text/html'});
        this.res.end(this.queryStringParamsList());
    }
    queryStringParamsList() {
        // expose all the possible query strings
        let content = "<div style=font-family:arial>";
        content += "<h4>List of possible parameters in query strings:</h4>";
        content += "<h4>?sort=\"name\"</h4>";
        content += "<h4>?sort=\"category\"</h4>";
        content += "<h4>?name=\"nom\"</h4>";
        content += "<h4>?name=\"ab*\"</h4>";
        content += "<h4>?category=\"categorie\"</h4>";
        content += "</div>"
        return content;
    }
}