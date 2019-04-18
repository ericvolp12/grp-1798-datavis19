package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
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
	id      spotify.ID
	albumID spotify.ID
	count   int
}

func main() {

	tracks := []trackObject{
		trackObject{
			id:    spotify.ID("6DCZcSspjsKoFjzjrWoCdn"),
			count: 0,
		},
	}

	config := &clientcredentials.Config{
		ClientID:     os.Getenv("SPOTIFY_ID"),
		ClientSecret: os.Getenv("SPOTIFY_SECRET"),
		TokenURL:     spotify.TokenURL,
	}
	token, err := config.Token(context.Background())
	if err != nil {
		log.Fatalf("couldn't get token: %v", err)
	}

	client := spotify.Authenticator{}.NewClient(token)

	for i, t := range tracks {
		// Get a specific track
		track, err := client.GetTrack(t.id)
		if err != nil {
			log.Fatal(err)
		}

		// handle track results
		if track != nil {
			tracks[i].albumID = track.Album.ID
			tracks[i].count = getCountForAlbumAndTrack(track)
		}
		fmt.Printf("Track\n\tName: %s\n\tPlaycount: %d\n", track.Name, tracks[i].count)
	}
}

func getCountForAlbumAndTrack(track *spotify.FullTrack) int {
	url := fmt.Sprintf("https://t4ils.dev/api/beta/albumPlayCount?albumid=%s", track.Album.ID)

	countClient := http.Client{
		Timeout: time.Second * 2, // Maximum of 2 secs
	}

	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		log.Fatal(err)
	}

	res, getErr := countClient.Do(req)
	if getErr != nil {
		log.Fatal(getErr)
	}

	body, readErr := ioutil.ReadAll(res.Body)
	if readErr != nil {
		log.Fatal(readErr)
	}

	resObj := AlbumPlayCountResponse{}
	jsonErr := json.Unmarshal(body, &resObj)
	if jsonErr != nil {
		log.Fatal(jsonErr)
	}

	for _, v := range resObj.Data {
		if strings.Contains(v.URI, string(track.ID)) {
			return v.Playcount
		}
	}
	return 0
}
