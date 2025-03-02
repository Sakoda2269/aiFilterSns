package com.takotyann.aisns.controllers;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;

import com.takotyann.aisns.exceptions.FilterException;

import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/filter")
public class FilterController {
	
	private final WebClient webClient;
	private static final String API_KEY = System.getenv("GEMINI_API_KEY");
	private static final String API_URL = System.getenv("GEMINI_API_URL");
	private static final String[] filters = {
			"お嬢様言葉", 
			"ツンデレ妹言葉", 
			"ギャル風",
			"はわわ～って感じ",
			"王子様系男子風", 
			"俺様系男子風", 
			"吟遊詩人風",
			"ホスト風"
			};
	private static final String prompt = """
			{
			"contents": [{
				"parts": [{"text": "後に続く「」の中身を%sに変換して、結果のみを返してください。ただし、「」はいらないです。「%s」"}]
			}]
		}
								""";
	
	public FilterController(WebClient.Builder webClientBuilder) {
		this.webClient = webClientBuilder.baseUrl(API_URL).build();
	}
	
	@GetMapping("/filters")
	public ResponseEntity<List<String>> getFilters(){
		return ResponseEntity.ok(Arrays.asList(filters));
	}
	
	
	@PostMapping("")
	public Mono<ResponseEntity<String>> filter(@RequestParam("post") String post, @RequestParam("filter") int filter) {
		
		if(filter < 0 || filters.length <= filter) {
			throw new FilterException("そのフィルターは存在しません");
		}
		
		
		return webClient.post()
				.uri("/gemini-2.0-flash:generateContent?key=" + API_KEY)
				.bodyValue(prompt.formatted(filters[filter], post))
				.header("Content-Type", "application/json")
				.retrieve()
				.bodyToMono(Map.class)
				.map(response -> {
					List candidates = (List) response.get("candidates");
					Map tmp = (Map) candidates.get(0);
					Map content = (Map) tmp.get("content");
					List parts = (List) content.get("parts");
					Map res = (Map) parts.get(0);
					return ResponseEntity.ok((String) res.get("text"));
				});
				
	}
	
}
