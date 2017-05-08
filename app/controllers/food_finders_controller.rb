require 'bootstrap'
require "json"
require "http"
require "optparse"

# Place holders for Yelp Fusion's OAuth 2.0 credentials. Grab them
# from https://www.yelp.com/developers/v3/manage_app
CLIENT_ID = "LSaHQC1e5AnvvQ-5HPm6vA"
CLIENT_SECRET = ENV['YELP_API_SECRET']


# Constants, do not change these
API_HOST = "https://api.yelp.com"
SEARCH_PATH = "/v3/businesses/search"
BUSINESS_PATH = "/v3/businesses/"  # trailing / because we append the business id to the path
TOKEN_PATH = "/oauth2/token"
GRANT_TYPE = "client_credentials"

class FoodFindersController < ApplicationController
	@@latitude = nil
	@@longitude = nil

	def bearer_token
		# Put the url together
		url = "#{API_HOST}#{TOKEN_PATH}"

		raise "Please set your CLIENT_ID" if CLIENT_ID.nil?
		raise "Please set your CLIENT_SECRET" if CLIENT_SECRET.nil?

		# Build our params hash
		params = {
			client_id: CLIENT_ID,
			client_secret: CLIENT_SECRET,
			grant_type: GRANT_TYPE
		}

		response = HTTP.post(url, params: params)
		parsed = response.parse

		"#{parsed['token_type']} #{parsed['access_token']}"
	end

	def search(term, lat, long)
		url = "#{API_HOST}#{SEARCH_PATH}"
		params = {
			term: term,
			latitude: lat,
			longitude: long,
			radius: 16000,
			limit: 50,
			price: "1,2",
			open_now: true
		}

		response = HTTP.auth(bearer_token).get(url, params: params)
		response.parse
	end

	def create
		@@latitude = params[:latitude]
		@@longitude = params[:longitude]
	end

	def show
		@restuarant = search("Restuarant", @@latitude, @@longitude)
		@breakfast = search("Breakfast", @@latitude, @@longitude)
		@lunch = search("Lunch", @@latitude, @@longitude)
		@dinner = search("Dinner", @@latitude, @@longitude)
		@boba = search("Boba", @@latitude, @@longitude)

		@results = {
			:restuarant => @restuarant,
			:breakfast => @breakfast,
			:lunch => @lunch,
			:dinner => @dinner,
			:boba => @boba
		}

		render json: @results
	end

	# def index

	# end
end
