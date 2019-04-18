package main

import (
	"context"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/zmb3/spotify"
	"golang.org/x/oauth2/clientcredentials"
)

// AlbumPlayCountResponse holds a response from the playcount API
type AlbumPlayCountResponse struct {
	Success bool `json:"success"`
	Data    []struct {
		Name      string `json:"name"`
		Playcount int    `json:"playcount"`
		Disc      int    `json:"disc"`
		Number    int    `json:"number"`
		URI       string `json:"uri"`
	} `json:"data"`
}

type trackObject struct {
	id               spotify.ID
	albumID          spotify.ID
	name             string
	artists          string
	danceability     float64
	energy           float64
	key              float64
	loudness         float64
	mode             float64
	speechiness      float64
	acousticness     float64
	instrumentalness float64
	liveness         float64
	valence          float64
	tempo            float64
	durationMs       float64
	timeSignature    float64
	count            int
}

func main() {

	tracks, err := loadCsvFile("spotify_top_2018.csv")
	if err != nil {
		log.Fatal(err)
	}

	var client spotify.Client

	// Initialize the Spotify Client
	err = initSpotifyClient(&client)
	if err != nil {
		log.Fatalf("Couldn't get Spotify client token: %s\n", err)
	}

	// Fetch the data for each track
	for i, t := range tracks {
		tracks[i], err = fetchTrackData(t, client)
		if err != nil {
			log.Fatalf("Error fetching track data for track %s, err: %s\n", t.id, err)
		}
		fmt.Printf("Track\n\tName: %s\n\tPlaycount: %d\n", tracks[i].name, tracks[i].count)
	}
}

func loadCsvFile(filename string) ([]trackObject, error) {
	// Open CSV file
	f, err := os.Open(filename)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	// Read File into a Variable
	lines, err := csv.NewReader(f).ReadAll()
	if err != nil {
		panic(err)
	}

	tracks := make([]trackObject, 0)

	// Loop through lines & turn into object
	for _, line := range lines[1:] {
		danceability, err := strconv.ParseFloat(line[3], 64)
		energy, err := strconv.ParseFloat(line[4], 64)
		key, err := strconv.ParseFloat(line[5], 64)
		loudness, err := strconv.ParseFloat(line[6], 64)
		mode, err := strconv.ParseFloat(line[7], 64)
		speechiness, err := strconv.ParseFloat(line[8], 64)
		acousticness, err := strconv.ParseFloat(line[9], 64)
		instrumentalness, err := strconv.ParseFloat(line[10], 64)
		liveness, err := strconv.ParseFloat(line[11], 64)
		valence, err := strconv.ParseFloat(line[12], 64)
		tempo, err := strconv.ParseFloat(line[13], 64)
		durationMs, err := strconv.ParseFloat(line[14], 64)
		timeSignature, err := strconv.ParseFloat(line[14], 64)
		if err != nil {
			return nil, err
		}
		track := trackObject{
			id:               spotify.ID(line[0]),
			name:             line[1],
			artists:          line[2],
			danceability:     danceability,
			energy:           energy,
			key:              key,
			loudness:         loudness,
			mode:             mode,
			speechiness:      speechiness,
			acousticness:     acousticness,
			instrumentalness: instrumentalness,
			liveness:         liveness,
			valence:          valence,
			tempo:            tempo,
			durationMs:       durationMs,
			timeSignature:    timeSignature,
		}
		tracks = append(tracks, track)
	}
	return tracks, nil
}

func fetchTrackData(t trackObject, client spotify.Client) (trackObject, error) {
	// Get a specific track
	track, err := client.GetTrack(t.id)
	if err != nil {
		return t, err
	}

	// handle track results
	if track != nil {
		t.albumID = track.Album.ID
		t.name = track.Name
		// Fetch playcount data
		t.count = getCountForAlbumAndTrack(track)
	}
	return t, nil
}

func initSpotifyClient(client *spotify.Client) error {
	config := &clientcredentials.Config{
		ClientID:     os.Getenv("SPOTIFY_ID"),
		ClientSecret: os.Getenv("SPOTIFY_SECRET"),
		TokenURL:     spotify.TokenURL,
	}
	token, err := config.Token(context.Background())
	if err != nil {
		return err
	}

	*client = spotify.Authenticator{}.NewClient(token)

	return nil
}

func getCountForAlbumAndTrack(track *spotify.FullTrack) int {
	url := fmt.Sprintf("https://t4ils.dev/api/beta/albumPlayCount?albumid=%s", track.Album.ID)

	countClient := http.Client{
		Timeout: time.Second * 5, // 5 sec timeout
	}

	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		log.Fatal(err)
	}

	res, err := countClient.Do(req)
	if err != nil {
		log.Fatal(err)
	}

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		log.Fatal(err)
	}

	res.Body.Close()

	resObj := AlbumPlayCountResponse{}
	// Unpack response into a AlbumPlayCountResponse object
	err = json.Unmarshal(body, &resObj)
	if err != nil {
		log.Fatal(err)
	}

	for _, v := range resObj.Data {
		// Search the tracks in the album for our track ID
		if strings.Contains(v.URI, string(track.ID)) {
			return v.Playcount
		}
	}
	return 0
}
